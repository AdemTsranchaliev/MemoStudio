using System;
using Memo_Studio_Library.Data.Models;
using Memo_Studio_Library.ViewModels;

namespace Memo_Studio_Library.Services
{
    public interface IDayService
    {
        public Task AddDay(DayAddViewModel model, Guid facilityId);
        public Task<Day> GetDayForFacility(DateTime dateTime, Guid facilityId);
    }
}

