using System;
using Memo_Studio_Library.Models;

namespace Memo_Studio_Library
{
    public interface IBookingService
	{
		public Task AddBookign(BookingViewModel booking);
		public List<Booking> GetBookingsByDate(DateTime dateTime);
		public List<Booking> GetBookingsByRange(DateTime periodStart, DateTime periodEnd);
		public Task RemoveBooking(int id);
    }
}

