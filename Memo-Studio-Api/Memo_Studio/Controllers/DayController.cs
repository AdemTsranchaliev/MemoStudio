using Memo_Studio_Library.Services;
using Memo_Studio_Library.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Memo_Studio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DayController : BaseController
    {
        private readonly IDayService dayService;

        public DayController(IDayService dayService)
        {
            this.dayService = dayService;
        }

        [Authorize]
        [HttpGet("{dateTime}")]
        public IActionResult GetDay(DateTime dateTime)
        {
            var facilityId = GetFacilityId();

            var result = dayService.GetDayForFacility(dateTime, facilityId);

            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddDay([FromBody] DayAddViewModel model)
        {
            var facilityId = GetFacilityId();
            await dayService.AddDay(model, facilityId);

            return Ok();
        }

        //[Authorize]
        //[HttpPost("holiday")]
        //public async Task<IActionResult> SetHoliday([FromBody] Day model)
        //{
        //        await dayService.CancelDay(model);
        //
        //    return Ok();
        //}
    }
}

