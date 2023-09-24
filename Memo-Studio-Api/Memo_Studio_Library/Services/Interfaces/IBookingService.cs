using System;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.ViewModels.Booking;

namespace Memo_Studio_Library
{
    public interface IBookingService
	{
		public Task<Booking> AddBookign(BookingViewModel booking);
		public Task<List<Booking>> GetBookingsByDate(DateTime dateTime, Guid facilityId);
		public List<Booking> GetBookingsByRange(DateTime periodStart, DateTime periodEnd);
		public Task RemoveBooking(int id);
		public Task<string> GetViberIdByBookingId(int id);
		public Task<Booking> GetBookingByBookingId(int id);
		public Task<List<Booking>> GetBookingByReservationId(string id);
		public Task<List<MonthDaysStatisticsResponse>> GetMonthDaysStatistics(Guid facilityId, int month, int year);
    }
}

