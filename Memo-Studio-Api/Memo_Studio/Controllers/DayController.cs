using System;
using Memo_Studio_Library;
using Memo_Studio_Library.Data.Models;
using Memo_Studio_Library.Services;
using Microsoft.AspNetCore.Mvc;

namespace Memo_Studio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DayController : ControllerBase
    {
        private readonly IDayService dayService;

        public DayController(IDayService dayService)
        {
            this.dayService = dayService;
        }

        [HttpGet("{dateTime}/{clientId}")]
        public IActionResult GetDay(DateTime dateTime, int clientId)
        {
            var result = dayService.GetDay(dateTime, clientId);

            return Ok(result);
        }

        [HttpPost("AddDay")]
        public IActionResult AddDay([FromBody] Day model)
        {
            dayService.AddDay(model);

            return Ok();
        }
        [HttpPost("holiday")]
        public async Task<IActionResult> SetHoliday([FromBody] Day model)
        {
                await dayService.CancelDay(model);

            return Ok();
        }
    }
}

