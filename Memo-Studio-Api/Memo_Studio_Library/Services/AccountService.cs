using Memo_Studio_Library.Models;
using Memo_Studio_Library.Services.Interfaces;
using Memo_Studio_Library.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;

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

        public async Task ChangePassword(ChangePasswordViewModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);

            if (user == null)
                throw new Exception("Невалидна заявка");

            var result = await userManager.ResetPasswordAsync(user, model.OldPassword, model.Password);

            if (!result.Succeeded)
            {
                throw new Exception("Excpetion");
            }
        }
    }
}

