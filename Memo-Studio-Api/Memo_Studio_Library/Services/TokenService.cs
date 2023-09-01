using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;
using Memo_Studio_Library.Models;

namespace Memo_Studio_Library.Services
{
	public class TokenService : ITokenService
	{
        private readonly IConfiguration configuration;

        public TokenService(IConfiguration configuration)
		{
            this.configuration = configuration;
        }

        public string GenerateBearerToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var descriptor = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration["JwtSettings:Key"]!));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: descriptor, 
                issuer: configuration["JwtSettings:Issuer"],
                audience: configuration["JwtSettings:Audience"],
                expires: DateTime.UtcNow.AddDays(int.Parse(configuration["JwtSettings:ExpirationMinutes"]!)),
                signingCredentials: cred);
            
            return tokenHandler.WriteToken(token);
        }
    }
}

