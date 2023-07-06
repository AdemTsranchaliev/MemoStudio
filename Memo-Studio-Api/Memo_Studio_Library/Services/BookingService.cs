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

        public async Task<Booking> AddBookign(BookingViewModel booking)
        {
            using (var context = new StudioContext())
            {
                var newBooking = new Booking
                {
                    CreatedOn = DateTime.Now,
                    EmployeeId = booking.EmployeeId,
                    Timestamp = booking.DateTime.ToLocalTime(),
                    UserId = booking.UserId,
                    ReservationId = booking.ReservationId,
                    Note = booking.Note
                };
                var resut = await context.Bookings.AddAsync(newBooking);
                await context.SaveChangesAsync();

                return resut.Entity;
            }
        }

        public List<Booking> GetBookingsByDate(DateTime dateTime, int clientId)
        {
            using (var context = new StudioContext())
            {
                var start = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day,0,0,0);
                var end = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day,23,59,59);
                return context.Bookings
                    .Include(x => x.User)
                    .Where(x=>x.Timestamp>= start && x.Timestamp <=end && x.EmployeeId==clientId && !x.Canceled).ToList();
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
                var allBookings = context.Bookings.Where(x=>x.ReservationId==model.ReservationId);

                await allBookings.ForEachAsync(x => x.Canceled = true);

                context.Bookings.UpdateRange(allBookings);
                await context.SaveChangesAsync();
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

                if (booking == null || booking.User == null || booking.User.ViberId == null)
                {
                    return null;
                }

                return booking;
            }
        }

        public async Task<List<Booking>> GetBookingByReservationId(string id)
        {
            using (var context = new StudioContext())
            {
                var bookings = await context.Bookings
                     .Where(x => x.ReservationId == id)
                     .ToListAsync();             

                return bookings;
            }
        }
    }
}

