using System;
using System.Security.Claims;
using Memo_Studio_Library.Models;

namespace Memo_Studio_Library.Services
{
	public interface ITokenService
    {
        public string GenerateBearerToken(User user);
    }
}

