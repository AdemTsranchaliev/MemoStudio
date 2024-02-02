
using Memo_Studio_Library.Data.Models;
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
        [HttpPost("facility-settings")]
        public async Task<IActionResult> UpdateFacilitySettings([FromBody] FacilitySettingsViewModel model)
        {
            var facilityId = this.GetFacilityId();

            await facilityService.UpdateFacilitySettings(model, facilityId);

            return Ok();
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
        public async Task<IActionResult> UpserServiceCategory([FromBody] ServiceCategoryViewModel model)
        {
            var facilityId = this.GetFacilityId();

            var newCategory = await facilityService.UpsertServiceCategory(model, facilityId);

            var result = new ServiceCategoryViewModel
            {
                Id = newCategory.Id,
                Name = newCategory.Name
            };

            return Ok(result);
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
        [HttpDelete("service/{serviceId}")]
        public async Task<IActionResult> DeleteService(int serviceId)
        {
            try
            {
                var facilityId = this.GetFacilityId();

                await facilityService.DeleteService(serviceId, facilityId);

                return Ok();
            }
            catch(Exception ex)
            {
                throw new Exception("Нещо се обърка. Моля опитайте отново");
            }   
        }

        [Authorize]
        [HttpDelete("service-category/{categoryId}")]
        public async Task<IActionResult> DeleteServiceCategory(int categoryId)
        {
            var facilityId = this.GetFacilityId();

            await facilityService.DeleteServiceCategory(categoryId, facilityId);

            return Ok();
        }

        [Authorize]
        [HttpPost("service")]
        public async Task<IActionResult> AddServices([FromBody] ServiceViewModel model)
        {
            var facilityId = this.GetFacilityId();

            var newService = await facilityService.AddService(model, facilityId);

            var result = new ServiceViewModel
            {
                ServiceCategoryId = newService.ServiceCategoryId,
                Description = newService.Description,
                Duration = newService.Duration,
                Id = newService.Id,
                Name = newService.Name,
                Price = newService.Price
            };

            return Ok(result);
        }
    }
}

