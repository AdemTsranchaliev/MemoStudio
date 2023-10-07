using System;
using Memo_Studio_Library.Data.Models;
using Memo_Studio_Library.ViewModels.Viber;

namespace Memo_Studio_Library.Services.Interfaces
{
	public interface IViberService
	{
        public Task<ViberCodeGenerationResponse> GenerateConfirmationCode(string userEmail);
        public Task<bool> ValidateConfirmationCode(string code, string viberId)
    }
}

