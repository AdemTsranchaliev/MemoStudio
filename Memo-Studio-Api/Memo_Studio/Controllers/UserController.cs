using System;
using Memo_Studio_Library;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Memo_Studio.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService userService { get; }

        public UserController(IUserService userService)
        {
            this.userService = userService;
        }
        [HttpGet("getAllUsers")]
        public async Task<IActionResult> Get()
        {
            var users = userService.GetAllUsers();
            return Ok(users);
        }

        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser([FromBody] UserViewModel model)
        {
            userService.AddUser(model);

            return Ok();
        }
    }
}

