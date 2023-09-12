using System;
using Memo_Studio_Library;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.Services;
using Memo_Studio_Library.Services.Interfaces;
using Memo_Studio_Library.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace Memo_Studio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
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

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            try
            {
                await accountService.RegisterAsync(model);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("Нещо се обърка. Моля опитайте отново.");
            }
        }

        [AllowAnonymous]
        [HttpPost("EmailConfirmation")]
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
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            try
            {
                await accountService.ChangePassword(model);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Нещо се обърка. Моля опитайте отново.");
            }
        }
    }
}

