using System;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.ViewModels;
using Memo_Studio_Library.ViewModels.Account;
using Microsoft.AspNetCore.Http;

namespace Memo_Studio_Library.Services.Interfaces
{
	public interface IAccountService
	{
		public Task RegisterAsync(RegisterViewModel user);
		public Task SendEmailConfirmationAsync(User user);
		public Task ConfirmEmailAsync(EmailConfirmationRequest req);
		public Task SendChangePasswordEmailAsync(string email);
		public Task ChangePassword(ChangePasswordViewModel model);
		public Task ResetPassword(ResetPasswordViewModel model);

        public Task<AccountViewModel> GetUserByEmailAsync(string email);
		public Task UpdateAccountInformation(AccountRequestViewModel model, string email);
		public Task UploadProfilePicture(IFormFile model, string email);
		public string GetFile(string fileName);
    }
}

