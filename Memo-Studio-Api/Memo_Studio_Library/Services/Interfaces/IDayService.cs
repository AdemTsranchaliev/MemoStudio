using System;
using Memo_Studio_Library.Data.Models;

namespace Memo_Studio_Library.Services
{
    public interface IDayService
    {
        public void AddDay(Day model);
        public Day GetDay(DateTime dateTime, int employeeId);
        public Task CancelDay(Day day);
        public Task<Day> GetDayForFacility(DateTime dateTime, int facilityId);
    }
}

