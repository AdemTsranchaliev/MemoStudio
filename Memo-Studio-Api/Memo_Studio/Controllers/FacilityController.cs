
using Memo_Studio_Library.Services.Interfaces;
using Memo_Studio_Library.ViewModels.FacilityViewModels;
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

        [Authorize]
        [HttpGet("users")]
        public async Task<IActionResult> GetSubscribedUsers()
        {
            var facilityId = this.GetFacilityId();

            var result = await facilityService.GetSubscribedUsers(facilityId);

            return Ok(result);
        }

        [Authorize]
        [HttpGet("users-reservations/{userId}")]
        public async Task<IActionResult> GetUserReservations(string userId)
        {
            var facilityId = this.GetFacilityId();

            var result = await facilityService.GetUserReservations(facilityId, Guid.Parse(userId));

            return Ok(result);
        }

        [Authorize]
        [HttpGet("users-notifications/{userId}")]
        public async Task<IActionResult> GetUserNotifications(string userId)
        {
            var facilityId = this.GetFacilityId();

            var result = await facilityService.GetUserNotifications(facilityId, Guid.Parse(userId));

            return Ok(result);
        }

        [Authorize]
        [HttpGet("facility-settings")]
        public async Task<IActionResult> GetFacilitySettings()
        {
            var facilityId = this.GetFacilityId();

            var result = await facilityService.GetFacilitySettings(facilityId);

            return Ok(result);
        }

        [Authorize]
        [HttpGet("facility-users")]
        public async Task<IActionResult> GetFacilityUsers()
        {
            var facilityId = this.GetFacilityId();

            var result = await facilityService.GetFacilityUsers(facilityId);

            return Ok(result);
        }

        [Authorize]
        [HttpPost("service-category")]
        public async Task<IActionResult> AddServiceCategory([FromBody] ServiceCategoryViewModel model)
        {
            var facilityId = this.GetFacilityId();

            await facilityService.UpsertServiceCategory(model, facilityId);

            return Ok();
        }

        [Authorize]
        [HttpGet("service")]
        public async Task<IActionResult> GetServices()
        {
            var facilityId = this.GetFacilityId();

            var result = await facilityService.GetServices(facilityId);

            return Ok(result);
        }

        [Authorize]
        [HttpPost("service")]
        public async Task<IActionResult> AddServices([FromBody] ServiceViewModel model)
        {
            var facilityId = this.GetFacilityId();

            await facilityService.AddService(model, facilityId);

            return Ok();
        }
    }
}

