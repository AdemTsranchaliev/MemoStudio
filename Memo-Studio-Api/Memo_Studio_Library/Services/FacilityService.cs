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

        public async Task<Facility> GetFacilityById(Guid facilityId)
        {
            var facility = await context.Facilities.FirstOrDefaultAsync(x=>x.FacilityId == facilityId);

            return facility;
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
                throw new Exception("Получи се грешка при запазването на данните. Моля опитайте отново.");
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

        public async Task<FacilitySettingsViewModel> GetFacilitySettings(Guid facilityId)
        {
            try
            {
                var facilitySettings = await context.Facilities
                    .FirstOrDefaultAsync(x => x.FacilityId == facilityId);

                if (facilitySettings == null)
                {
                    return null;
                }

                var result = new FacilitySettingsViewModel
                {
                    AllowUserBooking = facilitySettings.AllowUserBooking,
                    EndPeriod = facilitySettings.EndPeriod,
                    StartPeriod = facilitySettings.StartPeriod,
                    Interval = facilitySettings.Interval,
                    WorkingDaysJson = facilitySettings.WorkingDays
                };

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception();
            }
        }

        public async Task UpdateFacilitySettings(FacilitySettingsViewModel model, Guid facilityId)
        {
            try
            {
                var facilitySettings = await context.Facilities
                    .FirstOrDefaultAsync(x => x.FacilityId == facilityId);

                if (facilitySettings == null)
                {
                    return;
                }
                facilitySettings.EndPeriod = new DateTime(0,0,0,model.EndPeriod.ToLocalTime().Hour,model.StartPeriod.ToLocalTime().Minute,0);
                facilitySettings.StartPeriod = new DateTime(0,0,0,model.StartPeriod.ToLocalTime().Hour,model.StartPeriod.ToLocalTime().Minute,0);

                facilitySettings.WorkingDays = model.WorkingDaysJson;
                facilitySettings.Interval = model.Interval;
                facilitySettings.AllowUserBooking = model.AllowUserBooking;

                context.Facilities.Update(facilitySettings);
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception();
            }
        }

        public async Task UpsertServiceCategory(ServiceCategoryViewModel model, Guid facilityId)
        {
            try
            {
                var facility = await context.Facilities
                    .Include(x => x.ServiceCategories)
                    .FirstOrDefaultAsync(x => x.FacilityId == facilityId);

                if (facility == null)
                {
                    return;
                }

                var serviceCategory = facility.ServiceCategories.FirstOrDefault(x => x.Id == model.Id);

                if (serviceCategory == null)
                {
                    var newModel = new ServiceCategory
                    {
                        Name = model.Name,
                        FacilityId = facility.Id
                    };

                    await context.ServiceCategories.AddAsync(newModel);
                }
                else
                {
                    serviceCategory.Name = model.Name;
                    context.ServiceCategories.Update(serviceCategory);
                }

                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Нещо се обърка, моля свържете се с поддръжката.");
            }
        }

        public async Task AddService(ServiceViewModel model, Guid facilityId)
        {
            try
            {
                var facility = await context.Facilities
                    .Include(x => x.ServiceCategories)
                    .ThenInclude(y => y.Services)
                    .FirstOrDefaultAsync(x => x.FacilityId == facilityId);

                if (facility == null)
                {
                    return;
                }

                var newService = new Service
                {
                    Description = model.Description,
                    Name = model.Name,
                    Duration = model.Duration,
                    FacilityId = facility.Id,
                    Price = model.Price,
                    ServiceCategoryId = 1 //model.ServiceCategoryId
                };

                await context.Services.AddAsync(newService);
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Нещо се обърка, моля свържете се с поддръжката.");
            }
        }

        public async Task<List<BookingUsersAutocompleteViewModel>> GetFacilityUsers(Guid facilityId)
        {
            try
            {
                var facility = await context.Facilities
                    .Include(x => x.Bookings)
                        .ThenInclude(x => x.User)
                    .FirstOrDefaultAsync(x => x.FacilityId == facilityId);

                facility.Bookings = facility.Bookings.Where(x => !string.IsNullOrEmpty(x.Name) && !string.IsNullOrEmpty(x.Phone)).ToList();

                var result = new List<BookingUsersAutocompleteViewModel>();
                foreach (var booking in facility?.Bookings)
                {
                    if (!result.Any(x => x.Name == booking.Name && x.Phone == booking.Phone && x?.UserId == null)
                        || !result.Any(x => x?.UserId == booking?.User?.UserId.ToString()))
                    {
                        var record = new BookingUsersAutocompleteViewModel
                        {
                            Name = booking.Name,
                            Email = booking.Email,
                            Phone = booking.Phone
                        };

                        if (booking.UserId != null)
                        {
                            record.RegisteredUser = true;
                            record.UserId = booking?.User.UserId.ToString();
                        }

                        result.Add(record);
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception("Нещо се обърка, моля свържете се с поддръжката.");
            }
        }

        public async Task<List<ServiceCategoryResponse>> GetServices(Guid facilityId)
        {
            try
            {
                var facility = await context.Facilities
                    .Include(x => x.ServiceCategories)
                    .ThenInclude(y => y.Services)
                    .FirstOrDefaultAsync(x => x.FacilityId == facilityId);

                if (facility == null)
                {
                    return null;
                }
                var result = new List<ServiceCategoryResponse>();

                foreach (var category in facility.ServiceCategories)
                {
                    var tempCategory = new ServiceCategoryResponse
                    {
                        Id=category.Id,
                        Name = category.Name,
                        FacilityId = category.FacilityId,
                    };

                    foreach (var service in category.Services)
                    {
                        var tempService = new ServiceResponse
                        {
                            ServiceCategoryId=category.Id,
                            Price = service.Price,
                            Description = service.Description,
                            Duration = service.Duration,
                            Id = service.Id,
                            Name = service.Name,
                            FacilityId = service.FacilityId
                        };

                        tempCategory.Services.Add(tempService);
                    }

                    result.Add(tempCategory);
                }

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception("Нещо се обърка, моля свържете се с поддръжката.");
            }
        }
    }
}

