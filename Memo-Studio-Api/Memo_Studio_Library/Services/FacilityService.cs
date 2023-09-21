using Memo_Studio_Library.Data.Models;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.Services.Interfaces;
using Memo_Studio_Library.ViewModels.FacilityViewModels;
using Microsoft.EntityFrameworkCore;

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

        public async Task<List<FacilityUsersViewModel>> GetSubscribedUsers(Guid facilityId)
        {
            try
            {
                var result = await context.UserFalicities
                    .Include(x => x.User)
                    .Include(x => x.Facility)
                    .Include(x => x.FacilityRole)
                    .Where(x => x.Facility.FacilityId == facilityId && x.FacilityRole.Name == "Subscriber")
                    .Select(x => new FacilityUsersViewModel
                    {
                        UserId = x.User.UserId,
                        Name = x.User.Name,
                        Phone = x.User.Email

                    })
                    .ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception();
            }
        }

        public async Task<List<FacilityUserBookingsViewModel>> GetUserReservations(Guid facilityId, Guid userId)
        {
            try
            {
                var result = await context.Bookings
                    .Include(x => x.Facility)
                    .Include(c => c.User)
                    .Where(x => x.Facility.FacilityId == facilityId && x.User.UserId == userId)
                    .Select(x=>new FacilityUserBookingsViewModel
                    {
                        IsCanceled = x.Canceled,
                        Note = x.Note,
                        Timestamp = x.Timestamp
                    })
                    .ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception();
            }
        }

        public async Task<List<FacilityUserNotificationsViewModel>> GetUserNotifications(Guid facilityId, Guid userId)
        {
            try
            {
                var result = await context.Notifications
                    .Include(x => x.Facility)
                    .Include(c => c.User)
                    .Where(x => x.Facility.FacilityId == facilityId && x.User.UserId == userId)
                    .Select(x => new FacilityUserNotificationsViewModel
                    {
                        Message = x.Message,
                        SentOn = x.SentOn,
                        Status = 1,
                        Type = x.Type
                    })
                    .ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception();
            }
        }
    }
}

