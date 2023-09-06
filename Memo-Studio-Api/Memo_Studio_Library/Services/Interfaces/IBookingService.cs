using System;
using Memo_Studio_Library.Models;

namespace Memo_Studio_Library
{
    public interface IBookingService
	{
		public Task<Booking> AddBookign(BookingViewModel booking);
		public List<Booking> GetBookingsByDate(DateTime dateTime, int clientId);
		public List<Booking> GetBookingsByRange(DateTime periodStart, DateTime periodEnd);
		public Task RemoveBooking(int id);
		public Task<string> GetViberIdByBookingId(int id);
		public Task<Booking> GetBookingByBookingId(int id);
		public Task<List<Booking>> GetBookingByReservationId(string id);

    }
}

