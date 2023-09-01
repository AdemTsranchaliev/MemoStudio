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

            var allRelatedBookings = await bookingService.GetBookingByReservationId(booking.ReservationId);
            var bookingModel = await bookingService.AddBookign(booking);
            var newBooking = await bookingService.GetBookingByBookingId(bookingModel.Id);

            if (newBooking==null||newBooking.User==null||newBooking.User.ViberId==null)
            {
                return BadRequest();
            }

            CultureInfo culture = new CultureInfo("bg-BG");
            booking.DateTime = booking.DateTime.ToLocalTime();
            string day = booking.DateTime.ToString("dd");
            string month = culture.DateTimeFormat.GetMonthName(booking.DateTime.Month);
            string year = booking.DateTime.ToString("yyyy");
            string weekday = culture.DateTimeFormat.GetDayName(booking.DateTime.DayOfWeek);
            var hour = booking.DateTime.Hour <= 10 ? $"0{booking.DateTime.Hour}" : booking.DateTime.Hour.ToString();
            var minutes = booking.DateTime.Minute <= 10 ? $"0{booking.DateTime.Minute}" : booking.DateTime.Minute.ToString();

            var date = $"*({hour}:{minutes}ч.) - {weekday}, {day} {month} {year}г.*";
            if (booking.Index==0)
                {
                await messageService.SendMessage(newBooking.User.ViberId, $"Запазихте час за \n{date}");
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

            CultureInfo culture = new CultureInfo("bg-BG");

            string day = booking.Timestamp.ToString("dd");
            string month = culture.DateTimeFormat.GetMonthName(booking.Timestamp.Month);
            string year = booking.Timestamp.ToString("yyyy");
            string weekday = culture.DateTimeFormat.GetDayName(booking.Timestamp.DayOfWeek);
            var hour = booking.Timestamp.Hour <= 10 ? $"0{booking.Timestamp.Hour}" : booking.Timestamp.Hour.ToString();
            var minutes = booking.Timestamp.Minute <= 10 ? $"0{booking.Timestamp.Minute}" : booking.Timestamp.Minute.ToString();

            var date = $"*({hour}:{minutes}ч.) - {weekday}, {day} {month} {year}г.*";
            await messageService.SendMessage(booking.User.ViberId, $"Вашият час за \n{date} беше отменен.");

            return Ok();
        }
    }
}

