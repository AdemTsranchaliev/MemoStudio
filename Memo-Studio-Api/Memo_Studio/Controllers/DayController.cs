using Memo_Studio_Library.Services;
using Memo_Studio_Library.ViewModels;
using Memo_Studio_Library.ViewModels.Day;
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
        public async Task<IActionResult> GetDay(DateTime dateTime)
        {
            try
            {
                var facilityId = GetFacilityId();

                var result = await dayService.GetDayForFacility(dateTime, facilityId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                throw new Exception("Нещо се обърка. Моля опитайте отново");
            }
        }

        [Authorize]
        [HttpPost("add-day")]
        public async Task<IActionResult> AddDay([FromBody] DayAddViewModel model)
        {
            try
            {
                var facilityId = GetFacilityId();
                await dayService.AddDay(model, facilityId);

                return Ok();
            }
            catch (Exception ex)
            {
                throw new Exception("Нещо се обърка. Моля опитайте отново");
            }
        }

        [Authorize]
        [HttpPost("change-is-open")]
        public async Task<IActionResult> ChangeIsWorking([FromBody]AddHolidayViewModel model)
        {
            try
            {
                var facilityId = GetFacilityId();

                await dayService.ChangeDayStatus(model.dateTime, facilityId);

                return Ok();
            }
            catch (Exception ex)
            {
                throw new Exception("Нещо се обърка. Моля опитайте отново");
            }
        }
    }
}

