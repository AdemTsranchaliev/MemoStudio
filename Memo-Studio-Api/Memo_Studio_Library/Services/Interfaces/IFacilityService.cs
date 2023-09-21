﻿using Memo_Studio_Library.Models;
using Memo_Studio_Library.ViewModels.FacilityViewModels;

namespace Memo_Studio_Library.Services.Interfaces
{
	public interface IFacilityService
	{
        public Task CreateFacility(User user);
        public Task<List<FacilityUsersViewModel>> GetSubscribedUsers(Guid facilityId);
        public Task<List<FacilityUserBookingsViewModel>> GetUserReservations(Guid facilityId, Guid userId);
        public Task<List<FacilityUserNotificationsViewModel>> GetUserNotifications(Guid facilityId, Guid userId);
    }
}

