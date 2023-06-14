using System;
using System.Web.Http.Cors;
using Memo_Studio_Library;
using Microsoft.AspNetCore.Mvc;

namespace Memo_Studio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService bookingService;
        private readonly IMessageService messageService;

        public BookingController(IBookingService bookingService, IMessageService messageService)
        {
            this.bookingService = bookingService;
            this.messageService = messageService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddBooking([FromBody] BookingViewModel booking)
        {
            if (booking.UserId==null)
            {
                return BadRequest();
            }
            var allRelatedBookings = await bookingService.GetBookingByReservationId(booking.ReservationId);
            var bookingModel = await bookingService.AddBookign(booking);
            var newBooking = await bookingService.GetBookingByBookingId(bookingModel.Id);
            if (newBooking==null||newBooking.User==null||newBooking.User.ViberId==null)
            {
                return BadRequest();
            }

            if (booking.Index==0)
            {
                await messageService.SendMessage(newBooking.User.ViberId, $"Запазихте час за \n*{bookingModel.Timestamp.ToString("yyyy-MM-dd в HH:mm часа")}*");
            }
            return Ok();
        }

        [DisableCors]
        [HttpGet("{date}/{userId}/get")]
        public IActionResult GetBooking(DateTime date,int userId)
        {
            var bookings = bookingService.GetBookingsByDate(date,userId);
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
            var booking = await bookingService.GetBookingByBookingId(bookingId);
            if (booking == null)
            {
                return BadRequest();
            }
            await bookingService.RemoveBooking(bookingId);
            await messageService.SendMessage(booking.User.ViberId, $"Вашият час за \n*{booking.Timestamp.ToString("yyyy-MM-dd в HH:mm часа")}* беше отменен.");

            return Ok();
        }
    }
}

