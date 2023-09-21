using Memo_Studio_Library.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Memo_Studio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacilityController : ControllerBase
	{
        private readonly IFacilityService facilityService;

        public FacilityController(IFacilityService facilityService)
		{
            this.facilityService = facilityService;
        }

        [AllowAnonymous]
        [HttpGet("users/{facilityId}")]
        public async Task<IActionResult> GetSubscribedUsers(string facilityId)
        {
            var result = await facilityService.GetSubscribedUsers(Guid.Parse(facilityId));

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{facilityId}/users-reservations/{userId}")]
        public async Task<IActionResult> GetUserReservations(string facilityId,string userId)
        {
            var result = await facilityService.GetUserReservations(Guid.Parse(facilityId), Guid.Parse(userId));

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{facilityId}/users-notifications/{userId}")]
        public async Task<IActionResult> GetUserNotifications(string facilityId, string userId)
        {
            var result = await facilityService.GetUserNotifications(Guid.Parse(facilityId), Guid.Parse(userId));

            return Ok(result);
        }
    }
}

