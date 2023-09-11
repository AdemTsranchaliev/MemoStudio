using System;
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

        public AccountService(UserManager<User> userManager, IMailService mailService)
        {
            this.userManager = userManager;
            this.mailService = mailService;
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
                var clientUrl = $"http://localhost:4200/email-confirm";

                string link = QueryHelpers.AddQueryString(clientUrl, param);
                string message = $"Добре дошли в Glamgoo! Моля, потвърдете регистрацията си като проследите или копирате в адресната лента следния линк <a href=\"{link}\">НАТИСНЕТЕ ТУК</a>.";

                mailService.Send(user.Email, "Потвърждаване на имейл", message);
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

            var result = await userManager.ConfirmEmailAsync(user, request.Token);

            if (!result.Succeeded)
            {
                string errorMessage = string.Join("; ", result.Errors);
                throw new Exception("Възникна грешка при потвърждаване на имейла. Моля, свържете се с администратор.");
            }
        }
    }
}

