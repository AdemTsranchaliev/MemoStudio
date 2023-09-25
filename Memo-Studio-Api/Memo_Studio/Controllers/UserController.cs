using Memo_Studio_Library;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Memo_Studio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly StudioContext context;

        private IUserService userService { get; }
        public IAccountService accountService { get; }

        public UserController(IUserService userService, IAccountService accountService, UserManager<User> userManager, SignInManager<User> signInManager, StudioContext context)
        {
            this.userService = userService;
            this.accountService = accountService;
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.context = context;
        }

        [Authorize]
        [HttpGet("getAllUsers")]
        public async Task<IActionResult> Get()
        {
            try
            {
                var users = await userService.GetAllUsers();

                return Ok(users);
            }
            catch(Exception ex)
            {
            }
            return Ok();
        }

        [Authorize]
        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser([FromBody] UserViewModel model)
        {
            userService.AddUser(model);

            return Ok();
        }
    }
}

