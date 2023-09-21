using System;
using Memo_Studio_Library.Data.Models;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.Services.Interfaces;
using Memo_Studio_Library.ViewModels;

namespace Memo_Studio_Library.Services
{
	public class FacilityService : IFacilityService
	{
        private readonly StudioContext context;

        public FacilityService(StudioContext context)
		{
            this.context = context;
        }

        public async Task CreateFacility(User user)
        {
            try
            {
                var facility = new Facility
                {
                    Name = user.Name,
                    Description = string.Empty,
                    FacilityId = Guid.NewGuid(),            
                };

                var facilityUser = new UserFalicity
                {
                    Facility = facility,
                    User = user,
                    FacilityRoleId = 1
                };

                await context.UserFalicities.AddAsync(facilityUser);

                await context.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                int i = 0;
            }
        }
    }
}

