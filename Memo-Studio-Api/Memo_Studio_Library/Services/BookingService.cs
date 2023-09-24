using System;
using System.Collections.Generic;
using Memo_Studio_Library.Enums;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.Services;
using Memo_Studio_Library.Services.Interfaces;
using Memo_Studio_Library.ViewModels.Booking;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Memo_Studio_Library
{
    public class BookingService : IBookingService
	{
        private readonly StudioContext context;
        private readonly IFacilityService facilityService;
        private readonly IUserService userService;

        public BookingService(StudioContext context, IFacilityService facilityService, IUserService userService)
		{
            this.context = context;
            this.facilityService = facilityService;
            this.userService = userService;
        }

        public async Task<Booking> AddBookign(BookingViewModel booking)
        {
            var facility = await facilityService.GetFacilityById(booking.FacilityId);

            if (facility==null)
            {
                return null;
            }

            var newBooking = new Booking
            {
                CreatedOn = DateTime.Now,
                Timestamp = booking.DateTime.ToLocalTime(),
                FacilityId = facility.Id,
                Note = booking.Note,
                Duration = booking.Duration
            };


            if (booking?.UserId!=null)
            {
                var user = await userService.GetUserById(booking.UserId.Value);

                newBooking.UserId = user.Id;
            }
            else
            {
                newBooking.SetUnregisteredUser(booking.Name,booking.Email,booking.Phone);
            }

            var result = await context.Bookings.AddAsync(newBooking);
            await context.SaveChangesAsync();

            context.Entry(result.Entity).Reference(b => b.User).Load();

            return result.Entity;
        }

        public List<Booking> GetBookingsByDate(DateTime dateTime, int clientId)
        {
            using (var context = new StudioContext())
            {
                var start = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day,0,0,0);
                var end = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day,23,59,59);

                return context.Bookings
                    .Include(x => x.User)
                    .Where(x=>x.Timestamp>= start && x.Timestamp <=end && !x.Canceled).ToList();
            }
        }

        public List<Booking> GetBookingsByRange(DateTime periodStart, DateTime periodEnd)
        {
            try
            {
                using (var context = new StudioContext())
                {
                    if (periodStart > periodEnd)
                    {
                        return new List<Booking>();
                    }
                    return context.Bookings
                        .Include(x => x.User)
                        .Where(x => x.Timestamp >= periodStart && x.Timestamp <= periodEnd && !x.Canceled).ToList();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            
        }

        public async Task RemoveBooking(int id)
        {
            using (var context = new StudioContext())
            {              
                var model = context.Bookings.FirstOrDefault(x=>x.Id==id);
                if (model == null)
                {
                    return;
                }
                //var allBookings = context.Bookings.Where(x=>x.ReservationId==model.ReservationId);
                //
                //await allBookings.ForEachAsync(x => x.Canceled = true);
                //
                //context.Bookings.UpdateRange(allBookings);
                //await context.SaveChangesAsync();
            }
        }

        public async Task<string> GetViberIdByBookingId(int id)
        {
            using (var context = new StudioContext())
            {
                var booking = await context.Bookings
                     .Include(x => x.User)
                     .FirstOrDefaultAsync(x=>x.Id==id);

                if (booking == null || booking.User == null || booking.User.ViberId == null)
                {
                    return null;
                }

                return booking.User.ViberId;
            }
        }

        public async Task<Booking> GetBookingByBookingId(int id)
        {
            using (var context = new StudioContext())
            {
                var booking = await context.Bookings
                     .Include(x => x.User)
                     .FirstOrDefaultAsync(x => x.Id == id);

                if (booking == null || booking.User == null || booking.Canceled)
                {
                    return null;
                }

                return booking;
            }
        }

        public async Task<List<MonthDaysStatisticsResponse>> GetMonthDaysStatistics(Guid facilityId, int month, int year)
        {
            var result = new List<MonthDaysStatisticsResponse>();

            var facility = await context.Facilities
                 .FirstOrDefaultAsync(x => x.FacilityId == facilityId);

            var customDaysForFacility = await context.Days
                .Include(x=>x.Facility)
                .Where(x => x.DayDate.Month == month && x.DayDate.Year == year && x.Facility.FacilityId == facilityId)
                .ToListAsync();

            var bookings = await context.Bookings
                .Include(x => x.Facility)
                .Where(x => x.Timestamp.Month == month && x.Timestamp.Year == year && x.Facility.FacilityId == facilityId)
                .ToListAsync();

            if (facility == null)
            {
                return result;
            }

            var businessHours = JsonConvert.DeserializeObject<List<BusinessHoursViewModel>>(facility.WorkingDays);

            var daysInMonth = DateTime.DaysInMonth(year, month);

            for (int dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++)
            {
                if (dayOfMonth<DateTime.Now.Day)
                {
                    result.Add(new MonthDaysStatisticsResponse(dayOfMonth, (int)DayStatusEnum.Past));
                    continue;
                }
                DateTime currentDate = new DateTime(year, month, dayOfMonth);
                var dayOfWeek = currentDate.DayOfWeek;

                var customDay = customDaysForFacility.FirstOrDefault(x => x.DayDate.Day == dayOfMonth);

                if (customDay != null)
                {
                    if (!customDay.IsOpen)
                    {
                        result.Add(new MonthDaysStatisticsResponse(dayOfMonth, (int)DayStatusEnum.Closed));
                    }
                    else
                    {
                        var bookingsForDay = bookings.Where(x => x.Timestamp.Day == dayOfMonth).ToList();

                        var intervalCount = CalculateIntervalCount(customDay.StartPeriod, customDay.EndPeriod, customDay.Interval);

                        if (bookingsForDay.Count() == intervalCount)
                        {
                            result.Add(new MonthDaysStatisticsResponse(dayOfMonth, (int)DayStatusEnum.Full));
                        }
                        else
                        {
                            result.Add(new MonthDaysStatisticsResponse(dayOfMonth, (int)DayStatusEnum.Open));
                        }
                    }
                }
                else
                {
                    var bussinessDay = businessHours.FirstOrDefault(x => x.Id == (int)dayOfWeek);

                    if (bussinessDay!=null&&!bussinessDay.IsOpen)
                    {
                        result.Add(new MonthDaysStatisticsResponse(dayOfMonth,(int)DayStatusEnum.Closed));
                    }
                    else
                    {
                        var bookingsForDay = bookings.Where(x => x.Timestamp.Day == dayOfMonth).ToList();

                        var intervalCount = CalculateIntervalCount(facility.StartPeriod, facility.EndPeriod, facility.Interval);

                        if (bookingsForDay.Count() == intervalCount)
                        {
                            result.Add(new MonthDaysStatisticsResponse(dayOfMonth, (int)DayStatusEnum.Full));
                        }
                        else
                        {
                            result.Add(new MonthDaysStatisticsResponse(dayOfMonth, (int)DayStatusEnum.Open));
                        }
                    }
                }
            }


            return result;

        }

        public async Task<List<Booking>> GetBookingByReservationId(string id)
        {
            using (var context = new StudioContext())
            {
                var bookings = await context.Bookings
                     //.Where(x => x.ReservationId == id)
                     .ToListAsync();             

                return bookings;
            }
        }

        private int CalculateIntervalCount(DateTime startTime, DateTime endTime, int intervalMinutes)
        {
            int intervalCount = 0;

            int totalMinutes = (int)(endTime - startTime).TotalMinutes;

            intervalCount = totalMinutes / intervalMinutes;

            return intervalCount;
        }
    }
}

