using System;
using AutoMapper;
using Memo_Studio_Library.Data.Models;
using Memo_Studio_Library.Services.Interfaces;
using Memo_Studio_Library.ViewModels.Viber;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Memo_Studio_Library.Services
{
	public class ViberService : IViberService
	{
        private static readonly Random random = new Random();
        private readonly StudioContext context;
        private readonly IUserService userService;
        private readonly IMapper mapper;

        public ViberService(StudioContext context, IUserService userService, IMapper mapper)
		{
            this.context = context;
            this.userService = userService;
            this.mapper = mapper;
        }

        public async Task<ViberCodeGenerationResponse> GenerateConfirmationCode(string userEmail)
        {
            string code;
            bool codeExists;
            var user = await userService.GetUserByEmailWithCodesAsync(userEmail);

            var activeCode = user.ViberCodes.FirstOrDefault(x => !x.IsUsed && x.ValidTo > DateTime.Now);

            if (activeCode!=null)
            {
                var response = mapper.Map<ViberCodeGenerationResponse>(activeCode);
                return response;
            }

            do
            {
                code = Generate6DigitCode();

                codeExists = this.context.ViberCodes.Any(c => c.Code == code && c.ValidTo >= DateTime.Now && !c.IsUsed);
            }
            while (codeExists);

            if (user!=null)
            {
                var viberCode = new ViberCode
                {
                    Code = code,
                    ValidTo = DateTime.Now.AddMinutes(3),
                    GeneratedOn = DateTime.Now,
                    IsUsed = false,
                    UserId = user.Id
                };

                context.ViberCodes.Add(viberCode);

                await context.SaveChangesAsync();

                var response = mapper.Map<ViberCodeGenerationResponse>(viberCode);
                return response;
            }

            return null;
        }

        public async Task<bool> ValidateConfirmationCode(string code, string viberId)
        {
            var existingCode = await context.ViberCodes.Include(x=>x.User).FirstOrDefaultAsync(x=>x.Code==code&&x.ValidTo>=DateTime.Now&&!x.IsUsed);

            if (existingCode==null)
            {
                return false;
            }

            existingCode.User.ViberId = viberId;
            existingCode.IsUsed = true;

            context.Update(existingCode);

            return true;
        }

        private string Generate6DigitCode()
        {
            int min = 100000;
            int max = 999999;

            int code = random.Next(min, max + 1); 
            return code.ToString("D6");
        }
    }
}

