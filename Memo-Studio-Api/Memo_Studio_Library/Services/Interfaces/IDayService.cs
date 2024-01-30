using Memo_Studio_Library.Data.Models;
using Memo_Studio_Library.ViewModels;
using Memo_Studio_Library.ViewModels.Booking;

namespace Memo_Studio_Library.Services
{
    public interface IDayService
    {
        public Task AddDay(DayAddViewModel model, Guid facilityId);
        public Task<BusinessHoursViewModel?> GetDayForFacility(DateTime dateTime, Guid facilityId);
        public Task ChangeDayStatus(DateTime date, Guid facilityId);
    }
}

