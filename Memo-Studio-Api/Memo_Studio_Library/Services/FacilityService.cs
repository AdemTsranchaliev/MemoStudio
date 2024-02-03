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
        private readonly IFileService fileService;

        public FacilityService(StudioContext context, IFileService fileService)
        {
            this.context = context;
            this.fileService = fileService;
        }

        public async Task<Facility> GetFacilityById(Guid facilityId)
        {
            var facility = await context.Facilities.FirstOrDefaultAsync(x => x.FacilityId == facilityId);

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
            catch (Exception ex)
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
                    .Select(x => new FacilityUserBookingsViewModel
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
                facilitySettings.EndPeriod = new DateTime(1970, 1, 1, model.EndPeriod.Hour, model.StartPeriod.Minute, 0, DateTimeKind.Utc);
                facilitySettings.StartPeriod = new DateTime(1970, 1, 1, model.StartPeriod.Hour, model.StartPeriod.Minute, 0, DateTimeKind.Utc);

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

        public async Task<ServiceCategory?> UpsertServiceCategory(ServiceCategoryViewModel model, Guid facilityId)
        {
            try
            {
                var facility = await context.Facilities
                    .Include(x => x.ServiceCategories)
                    .FirstOrDefaultAsync(x => x.FacilityId == facilityId);

                if (facility == null)
                {
                    return null;
                }

                var serviceCategory = facility.ServiceCategories.FirstOrDefault(x => x.Id == model.Id);

                if (serviceCategory == null)
                {
                    serviceCategory = new ServiceCategory
                    {
                        Name = model.Name,
                        FacilityId = facility.Id,
                        CreatedDate = DateTime.UtcNow
                    };

                    await context.ServiceCategories.AddAsync(serviceCategory);
                }
                else
                {
                    serviceCategory.Name = model.Name;
                    context.ServiceCategories.Update(serviceCategory);
                }

                await context.SaveChangesAsync();

                return serviceCategory;
            }
            catch (Exception ex)
            {
                throw new Exception("Нещо се обърка, моля свържете се с поддръжката.");
            }
        }

        public async Task<Service?> AddService(ServiceViewModel model, Guid facilityId)
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

                var newService = new Service
                {
                    Description = model.Description,
                    Name = model.Name,
                    Duration = model.Duration,
                    FacilityId = facility.Id,
                    Price = model.Price,
                    ServiceCategoryId = model.ServiceCategoryId,
                    CreatedDate = DateTime.UtcNow
                };

                await context.Services.AddAsync(newService);
                await context.SaveChangesAsync();

                return newService;
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


        public async Task DeleteService(int serviceId, Guid facilityId)
        {
            var facility = await context.Facilities
                    .Include(x => x.Services)
                    .FirstOrDefaultAsync(x => x.FacilityId == facilityId);

            if (facility!=null && facility.Services.Any(x=>x.Id==serviceId))
            {
                var modelToDelete = facility.Services.FirstOrDefault(x => x.Id == serviceId);
                if (modelToDelete!=null)
                {
                    modelToDelete.DeletedDate = DateTime.UtcNow;
                    modelToDelete.Deleted = true;
                    context.Services.Update(modelToDelete);
                    await context.SaveChangesAsync();
                }

            }                  
        }
        public async Task DeleteServiceCategory(int categoryId, Guid facilityId)
        {
            try
            {
                var facility = await context.Facilities
                   .Include(x => x.ServiceCategories)
                   .ThenInclude(x=>x.Services)
                   .FirstOrDefaultAsync(x => x.FacilityId == facilityId);

                if (facility != null && facility.ServiceCategories.Any(x => x.Id == categoryId))
                {
                    var modelToDelete = facility.ServiceCategories.FirstOrDefault(x => x.Id == categoryId);
                    if (modelToDelete!=null)
                    {
                        foreach (var service in modelToDelete.Services)
                        {
                            service.Deleted = true;
                            service.DeletedDate = DateTime.UtcNow;
                        }
                        modelToDelete.Deleted = true;
                        modelToDelete.DeletedDate = DateTime.UtcNow;

                        context.ServiceCategories.Update(modelToDelete);
                        await context.SaveChangesAsync();
                    }
                }
            }
            catch(Exception ex)
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

                facility.ServiceCategories = facility.ServiceCategories.Where(x => !x.Deleted).ToList();

                foreach (var category in facility.ServiceCategories)
                {
                    var tempCategory = new ServiceCategoryResponse
                    {
                        Id = category.Id,
                        Name = category.Name,
                        FacilityId = category.FacilityId,
                    };

                    category.Services = category.Services.Where(x => !x.Deleted).ToList();

                    foreach (var service in category.Services)
                    {
                        var tempService = new ServiceResponse
                        {
                            ServiceCategoryId = category.Id,
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

        public async Task<FacilityInformationViewModel> GetFacilityInformation(Guid facilityId)
        {
            var facility = await context
                .Facilities
                .Include(x=>x.UserFalicities)
                .ThenInclude(x=>x.User)
                .FirstOrDefaultAsync(x => x.FacilityId == facilityId);

            if (facility==null)
            {
                return null;
            }
            var facilityOwner = facility.UserFalicities.FirstOrDefault(x => x.FacilityRoleId==1)?.User;

            var result = new FacilityInformationViewModel
            {
                Name = facility.Name,
                Category = "Маникюр & Педикюр",
                Email = facilityOwner.Email,
                ImageBase64 = facilityOwner.ImageBase64Code != null ? $"data:image/png;base64,{fileService.GetFile(facilityOwner.ImageBase64Code)}" : null,
                Phone = facilityOwner.PhoneNumber,
                FacebookLink = "facebook",
                InstagramLink = "instagram"
            };

            return result;
        }
    }
}

