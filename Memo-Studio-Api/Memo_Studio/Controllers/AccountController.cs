using System;
using Memo_Studio_Library;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.Services;
using Memo_Studio_Library.Services.Interfaces;
using Memo_Studio_Library.ViewModels;
using Memo_Studio_Library.ViewModels.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace Memo_Studio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : BaseController
	{
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly StudioContext context;

        public IAccountService accountService { get; }

        public AccountController(IAccountService accountService, UserManager<User> userManager, SignInManager<User> signInManager, StudioContext context)
        {
            this.accountService = accountService;
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.context = context;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            try
            {
                await accountService.RegisterAsync(model);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Нещо се обърка. Моля опитайте отново.");
            }
        }

        [AllowAnonymous]
        [HttpPost("email-confirmation")]
        public async Task<IActionResult> EmailConfirmation([FromBody]EmailConfirmationRequest request)
        {
            try
            {
                await accountService.ConfirmEmailAsync(request);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Нещо се обърка. Моля опитайте отново.");
            }
        }

        [AllowAnonymous]
        [HttpPost("forgotten-password")]
        public async Task<IActionResult> ForgottenPassword([FromBody] ForgottenPasswordViewModel model)
        {
            try
            {
                await accountService.SendChangePasswordEmailAsync(model.Email);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("Нещо се обърка. Моля опитайте отново.");
            }
        }

        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            try
            {
                await accountService.ResetPassword(model);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Нещо се обърка. Моля опитайте отново.");
            }
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            try
            {
                var email = GetEmail();
                await accountService.ChangePassword(model, email);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Нещо се обърка. Моля опитайте отново.");
            }
        }

        [Authorize]
        [HttpGet("information")]
        public async Task<IActionResult> GetAccountInformation()
        {
            try
            {
                var currentUserEmail = GetEmail();

                if (currentUserEmail == null)
                {
                    return Unauthorized();
                }

                var user = await accountService.GetUserByEmailAsync(currentUserEmail);

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest("Нещо се обърка. Моля опитайте отново.");
            }
        }

        [Authorize]
        [HttpPost("information")]
        public async Task<IActionResult> UpdateAccountInformation([FromBody] AccountRequestViewModel model)
        {
            try
            {
                var currentUserEmail = GetEmail();

                if (currentUserEmail == null)
                {
                    return Unauthorized();
                }

                await accountService.UpdateAccountInformation(model, currentUserEmail);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Нещо се обърка. Моля опитайте отново.");
            }
        }

        [Authorize]
        [HttpPost("profile-picture")]
        public async Task<IActionResult> UpdateProfilePicture([FromForm] IFormFile file)
        {
            try
            {
                var currentUserEmail = GetEmail();

                if (currentUserEmail == null)
                {
                    return Unauthorized();
                }

                await accountService.UploadProfilePicture(file, currentUserEmail);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Нещо се обърка. Моля опитайте отново.");
            }
        }

        [Authorize]
        [HttpGet("profile-picture")]
        public async Task<IActionResult> GetProfilePicture()
        {
            try
            {
                var currentUserEmail = GetEmail();

                if (currentUserEmail == null)
                {
                    return Unauthorized();
                }

                //var file = accountService.GetFile();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Нещо се обърка. Моля опитайте отново.");
            }
        }

        [Authorize]
        [HttpGet("calendar-profile-information")]
        public async Task<IActionResult> GetProfileInformationForCalendar()
        {
            try
            {
                var currentUserEmail = GetEmail();

                if (currentUserEmail == null)
                {
                    return Unauthorized();
                }

                var user = await accountService.GetUserByEmailAsync(currentUserEmail);

                var result = new CalendarProfileInformationViewModel
                {
                    Name = user.FacilityName,
                    ImageBase64 = user.ProfilePictureBase64
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest("Нещо се обърка. Моля опитайте отново.");
            }
        }

        [Authorize]
        [HttpGet("notification-settings")]
        public async Task<IActionResult> GetUserNotificationSettings()
        {
            try
            {
                var currentUserEmail = GetEmail();

                if (currentUserEmail == null)
                {
                    return Unauthorized();
                }

                var result = await accountService.GetUserNotificationSettingsByEmailAsync(currentUserEmail);            

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest("Нещо се обърка. Моля опитайте отново.");
            }
        }
    }
}

