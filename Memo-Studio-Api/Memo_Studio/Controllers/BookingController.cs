using System;
using System.Globalization;
using System.Web.Http.Cors;
using AutoMapper;
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
        private readonly IMapper mapper;

        public BookingController(IBookingService bookingService, IMessageService messageService, IMapper mapper)
        {
            this.bookingService = bookingService;
            this.messageService = messageService;
            this.mapper = mapper;
        }

        [AllowAnonymous]
        [HttpPost("add")]
        public async Task<IActionResult> AddBooking([FromBody] BookingViewModel booking)
        {
            var bookingModel = await bookingService.AddBookign(booking);

            //if (bookingModel.User.ViberId != null)
            //{
            //    var dateString = bookingModel.GetDateTimeInMessageFormat();
            //    await messageService.SendMessage(bookingModel.User.ViberId, $"Запазихте час за \n{dateString}");
            //}

            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("{date}/{facilityId}")]
        public async Task<IActionResult> GetBooking(DateTime date,Guid facilityId)
        {
            var bookings = await bookingService.GetBookingsByDate(date, facilityId);
            var result = mapper.Map<List<BookingsResponceViewModel>>(bookings);

            return Ok(result);
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

        [AllowAnonymous]
        [HttpGet("/{facilityId}/month-statistics/{month}/{year}")]
        public async Task<IActionResult> MonthDaysStatistic(string facilityId ,int month, int year)
        {
            var daysStatistics = await bookingService.GetMonthDaysStatistics(Guid.Parse(facilityId),month,year);
   
            return Ok(daysStatistics);
        }
    }
}

