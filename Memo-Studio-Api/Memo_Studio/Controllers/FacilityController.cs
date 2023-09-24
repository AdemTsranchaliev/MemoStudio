using Memo_Studio_Library.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Memo_Studio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacilityController : BaseController
	{
        private readonly IFacilityService facilityService;

        public FacilityController(IFacilityService facilityService)
		{
            this.facilityService = facilityService;
        }

        [AllowAnonymous]
        [HttpGet("users")]
        public async Task<IActionResult> GetSubscribedUsers()
        {
            var facilityId = this.GetFacilityId();

            var result = await facilityService.GetSubscribedUsers(facilityId);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("users-reservations/{userId}")]
        public async Task<IActionResult> GetUserReservations(string userId)
        {
            var facilityId = this.GetFacilityId();

            var result = await facilityService.GetUserReservations(facilityId, Guid.Parse(userId));

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("users-notifications/{userId}")]
        public async Task<IActionResult> GetUserNotifications(string userId)
        {
            var facilityId = this.GetFacilityId();

            var result = await facilityService.GetUserNotifications(facilityId, Guid.Parse(userId));

            return Ok(result);
        }
    }
}

