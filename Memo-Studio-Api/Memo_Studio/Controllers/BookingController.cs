using System;
using Memo_Studio_Library;
using Microsoft.AspNetCore.Mvc;

namespace Memo_Studio.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService bookingService;

        public BookingController(IBookingService bookingService)
        {
            this.bookingService = bookingService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddBooking([FromBody] BookingViewModel booking)
        {
            await bookingService.AddBookign(booking);
            return Ok();
        }

        [HttpGet("{date}/get")]
        public async Task<IActionResult> AddBooking(DateTime date)
        {
            var bookings = bookingService.GetBookingsByDate(date);
            var mapedBookings = bookings.Select(x =>
            {
                return new BookingsResponceViewModel
                {
                    Id = x.Id,
                    Name = x.User.Name,
                    Phone = x.User.Phone,
                    Year = x.Timestamp.Year,
                    Month = x.Timestamp.Month,
                    Day = x.Timestamp.Day,
                    Hour = x.Timestamp.Hour,
                    Minutes = x.Timestamp.Minute,
                    Free = false
                };
            });
            return Ok(mapedBookings);
        }

        [HttpDelete("{bookingId}")]
        public async Task<IActionResult> RemoveBooking(int bookingId)
        {
            await bookingService.RemoveBooking(bookingId);
            
            return Ok();
        }
    }
}

