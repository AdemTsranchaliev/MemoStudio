using System;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.ViewModels;

namespace Memo_Studio_Library.Services.Interfaces
{
	public interface IAccountService
	{
		public Task RegisterAsync(RegisterViewModel user);
		public Task SendEmailConfirmationAsync(User user);
		public Task ConfirmEmailAsync(EmailConfirmationRequest req);
		public Task SendChangePasswordEmailAsync(string email);
		public Task ChangePassword(ChangePasswordViewModel model);
    }
}

