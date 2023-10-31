using Memo_Studio_Library.Models;
using Memo_Studio_Library.Services.Interfaces;
using Memo_Studio_Library.ViewModels;
using Memo_Studio_Library.ViewModels.Account;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace Memo_Studio_Library.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<User> userManager;
        private readonly IMailService mailService;
        private readonly IFacilityService facilityService;

        public AccountService(UserManager<User> userManager, IMailService mailService, IFacilityService facilityService)
        {
            this.userManager = userManager;
            this.mailService = mailService;
            this.facilityService = facilityService;
        }

        public async Task SendEmailConfirmationAsync(User user)
        {
            try
            {
                var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
                var param = new Dictionary<string, string>
                    {
                       {"token", token },
                       {"email", user.Email }
                    };
                var clientUrl = $"http://localhost:4200/#/";
                var route = "email-confirm";

                string emailTitle = "Моля потвърдете вашият имейл";
                string emailDescription = "Натиснете бутона за да валидирате вашият имейл. След натискането ще бъдете препратени директно към сайта.";
                string emailButton = "Потвърди";
                string link = String.Concat(clientUrl, QueryHelpers.AddQueryString(route, param));

                mailService.Send(user.Email, "Потвърждаване на имейл", emailTitle, emailDescription, emailButton, link);
            }
            catch(Exception ex)
            {
                throw new Exception("err");
            }

        }

        public async Task ConfirmEmailAsync(EmailConfirmationRequest request)
        {
            var user = await userManager.FindByEmailAsync(request.Email);

            if (user == null)
                throw new Exception("Невалидна заявка");

            if (user.EmailConfirmed)
            {
                throw new Exception("Имейлът вече е потвърден.");
            }

            var result = await userManager.ConfirmEmailAsync(user, request.Token);

            if (!result.Succeeded)
            {
                string errorMessage = string.Join("; ", result.Errors);
                throw new Exception("Възникна грешка при потвърждаване на имейла. Моля, свържете се с администратор.");
            }
        }

        public async Task RegisterAsync(RegisterViewModel model)
        {
            var user = new User
            {
                UserName = model.Email,
                Email = model.Email,
                Name = model.Name,
                NormalizedUserName = model.Email,
                NormalizedEmail = model.Email.ToLower(),
                PhoneNumber = model.Phone,
                UserId = Guid.NewGuid()
            };

            var result = await userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await facilityService.CreateFacility(user);
                await this.SendEmailConfirmationAsync(user);

            }
        }

        public async Task SendChangePasswordEmailAsync(string email)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
                throw new Exception("Невалидна заявка");

            var token = await userManager.GeneratePasswordResetTokenAsync(user);

            var param = new Dictionary<string, string>
                    {
                       {"token", token },
                       {"email", user.Email }
                    };
            var clientUrl = $"http://localhost:4200/#/";
            var route = "change-password";
            string routeWithParams = QueryHelpers.AddQueryString(route, param);

            string emailTitle = "Забравивили сте паролата си?";
            string emailDescription = "Получихме искане Ви за подмяна на вашата парола. Нека започваме, натиснете на бутона по-долу за да Ви отведе в станицата за подмяна на паролата.";
            string emailButton = "Напред";
            var link = string.Concat(clientUrl, routeWithParams);

            mailService.Send(user.Email, "Смяна на забравена парола", emailTitle, emailDescription, emailButton, link);

        }

        public async Task ResetPassword(ResetPasswordViewModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);

            if (user == null)
                throw new Exception("Невалидна заявка");

            var result = await userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);

            if (!result.Succeeded)
            {
                throw new Exception("Excpetion");
            }
        }

        public async Task ChangePassword(ChangePasswordViewModel model, string email)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
                throw new Exception("Невалидна заявка");

            var result = await userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);

            if (!result.Succeeded)
            {
                throw new Exception("Excpetion");
            }
        }

        public async Task<AccountViewModel> GetUserByEmailAsync(string email)
        {
            var user = await userManager.Users
                .Include(u => u.UserFalicities)
                .ThenInclude(u=>u.Facility)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                throw new Exception("Невалидна заявка");

            var result = new AccountViewModel
            {
                Name = user.Name.Split(' ')[0],
                Surname = user.Name.Split(' ')[0],
                Email = user.Email,
                FacilityName = user.UserFalicities.FirstOrDefault()?.Facility.Name,
                Phone = user.PhoneNumber,
                ProfilePictureBase64 = user.ImageBase64Code != null ? $"data:image/png;base64,{this.GetFile(user.ImageBase64Code)}" : null
            };

            return result;
        }

        public async Task UpdateAccountInformation(AccountRequestViewModel model, string email)
        {
            var user = await userManager.Users
                .Include(u => u.UserFalicities)
                .ThenInclude(u => u.Facility)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                throw new Exception("Невалидна заявка");

            user.Name = $"{model.Name} {model.Surname}";
            user.PhoneNumber = model.Phone;
            user.UserFalicities.FirstOrDefault().Facility.Name = model.FacilityName;

            await userManager.UpdateAsync(user);
            
        }

        public async Task UploadProfilePicture(IFormFile file, string email)
        {
            var user = await userManager.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                throw new Exception("Невалидна заявка");


            user.ImageBase64Code = await this.UploadImage(file);

            await userManager.UpdateAsync(user);
        }

        private async Task<string> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new Exception();
            }

            try
            {
                // Define a folder where you want to save the uploaded files
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                if (!Directory.Exists(uploadFolder))
                {
                    Directory.CreateDirectory(uploadFolder);
                }

                // Generate a unique filename to avoid overwriting existing files
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return fileName;
            }
            catch (Exception ex)
            {
                throw new Exception();
            }
        }

        public string GetFile(string fileName)
        {
            if (fileName==null)
            {
                return null;
            }
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", fileName);

            if (System.IO.File.Exists(filePath))
            {
                var fileBytes = System.IO.File.ReadAllBytes(filePath);
                return Convert.ToBase64String(fileBytes);
            }

            return null;
        }

    }
}

