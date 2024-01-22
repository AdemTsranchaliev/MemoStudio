using Memo_Studio_Library.Data.Models;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.ViewModels.FacilityViewModels;

namespace Memo_Studio_Library.Services.Interfaces
{
	public interface IFacilityService
	{
        public Task CreateFacility(User user);
        public Task<Facility> GetFacilityById(Guid facilityId);
        public Task<List<FacilityUsersViewModel>> GetSubscribedUsers(Guid facilityId);
        public Task<List<FacilityUserBookingsViewModel>> GetUserReservations(Guid facilityId, Guid userId);
        public Task<List<FacilityUserNotificationsViewModel>> GetUserNotifications(Guid facilityId, Guid userId);
        public Task<FacilitySettingsViewModel> GetFacilitySettings(Guid facilityId);
        public Task UpdateFacilitySettings(FacilitySettingsViewModel model, Guid facilityId);
        public Task<ServiceCategory?> UpsertServiceCategory(ServiceCategoryViewModel model, Guid facilityId);
        public Task<List<ServiceCategoryResponse>> GetServices(Guid facilityId);
        public Task DeleteService(int serviceId, Guid facilityId);
        public Task DeleteServiceCategory(int categoryId, Guid facilityId);
        public Task<Service?> AddService(ServiceViewModel model, Guid facilityId);
        public Task<List<BookingUsersAutocompleteViewModel>> GetFacilityUsers(Guid facilityId);
    }
}

