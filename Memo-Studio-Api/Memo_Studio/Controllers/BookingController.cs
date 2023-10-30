using AutoMapper;
using Memo_Studio_Library;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Memo_Studio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : BaseController
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

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> AddBooking([FromBody] BookingViewModel booking)
        {
            var bookingModel = await bookingService.AddBookign(booking);

            if (bookingModel.User.ViberId != null)
            {
                var dateString = bookingModel.GetDateTimeInMessageFormat();
                await messageService.SendMessage(bookingModel.User.ViberId, $"Запазихте час за \n{dateString}");
            }
            
            return Ok();
        }

        [Authorize]
        [HttpGet("{date}")]
        public async Task<IActionResult> GetBooking(DateTime date)
        {
            var facilityId = this.GetFacilityId();

            var bookings = await bookingService.GetBookingsByDate(date, facilityId);
            var result = mapper.Map<List<BookingsResponceViewModel>>(bookings);

            return Ok(result);
        }

        [Authorize]
        [HttpDelete("{bookingId}")]
        public async Task<IActionResult> RemoveBooking(Guid bookingId, [FromQuery] Guid facilityId)
        {
            if (facilityId == null)
            {
                facilityId = this.GetFacilityId();
            }

            var booking = await bookingService.RemoveBooking(bookingId, facilityId);

            var date = booking.GetDateTimeInMessageFormat();

            if (booking.User.ViberId != null)
            {
                await messageService.SendMessage(booking.User.ViberId, $"Вашият час за \n{date} беше отменен.");
            }

            return Ok();
        }

        [Authorize]
        [HttpGet("month-statistics/{month}/{year}")]
        public async Task<IActionResult> MonthDaysStatistic(int month, int year, [FromQuery] Guid facilityId)
        {
            if (facilityId==null)
            {
                facilityId = this.GetFacilityId();
            }

            var daysStatistics = await bookingService.GetMonthDaysStatistics(facilityId, month, year);

            return Ok(daysStatistics);
        }
    }
}

