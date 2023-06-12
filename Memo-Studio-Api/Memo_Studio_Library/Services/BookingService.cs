using System;
using Memo_Studio_Library.Models;
using Microsoft.EntityFrameworkCore;

namespace Memo_Studio_Library
{
    public class BookingService : IBookingService
	{
		public BookingService()
		{
		}

        public async Task AddBookign(BookingViewModel booking)
        {
            using (var context = new StudioContext())
            {
                var newBooking = new Booking
                {
                    CreatedOn = DateTime.Now,
                    EmployeeId = booking.EmployeeId,
                    Timestamp = booking.DateTime.ToLocalTime(),
                    UserId = booking.UserId
                };
                await context.Bookings.AddAsync(newBooking);
                await context.SaveChangesAsync();
            }
        }

        public List<Booking> GetBookingsByDate(DateTime dateTime)
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
            using (var context = new StudioContext())
            {
                if (periodStart>periodEnd)
                {
                    return new List<Booking>();
                }
                return context.Bookings
                    .Include(x => x.User)
                    .Where(x => x.Timestamp >= periodStart && x.Timestamp <= periodEnd && !x.Canceled).ToList();
            }
        }

        public async Task RemoveBooking(int id)
        {
            using (var context = new StudioContext())
            {              
                var model = context.Bookings.FirstOrDefault(x=>x.Id==id);
                if (model==null)
                {
                    return;
                }
                model.Canceled = true;
                context.Bookings.Update(model);
                await context.SaveChangesAsync();
            }
        }
    }
}

