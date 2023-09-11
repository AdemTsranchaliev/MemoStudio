using System;
using System.Globalization;
using System.Web.Http.Cors;
using Memo_Studio_Library;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddBooking([FromBody] BookingViewModel booking)
        {
            if (booking.UserId==null)
            {
                return BadRequest();
            }

            var bookingModel = await bookingService.AddBookign(booking);

            if (bookingModel.User==null)
            {
                return BadRequest("The user do not exists!");
            }


            if (booking.Index==0 && bookingModel.User.ViberId != null)
            {
                var dateString = bookingModel.GetDateTimeInMessageFormat();
                await messageService.SendMessage(bookingModel.User.ViberId, $"Запазихте час за \n{dateString}");
            }

            return Ok();
        }

        [Authorize]
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
                    Phone = x.User.PhoneNumber,
                    Year = x.Timestamp.Year,
                    Month = x.Timestamp.Month,
                    Day = x.Timestamp.Day,
                    Hour = x.Timestamp.Hour,
                    Minutes = x.Timestamp.Minute,
                    Free = false,
                    Note = x.Note
                };
            });

            return Ok(mapedBookings);
        }

        [Authorize]
        [HttpDelete("{bookingId}")]
        public async Task<IActionResult> RemoveBooking(int bookingId)
        {
            var booking = await bookingService.GetBookingByBookingId(bookingId);
            if (booking == null)
            {
                return BadRequest();
            }
            await bookingService.RemoveBooking(bookingId);
          
            var date = booking.GetDateTimeInMessageFormat();

            if (booking.User.ViberId!=null)
            {
                await messageService.SendMessage(booking.User.ViberId, $"Вашият час за \n{date} беше отменен.");
            }

            return Ok();
        }
    }
}

