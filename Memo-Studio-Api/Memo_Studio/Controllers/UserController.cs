using System;
using Memo_Studio_Library;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Memo_Studio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService userService { get; }

        public UserController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = userService.GetUserById(id);
            return Ok(user);
        }

        [HttpGet("getAllUsers")]
        public async Task<IActionResult> Get()
        {
            var users = userService.GetAllUsers();
            return Ok(users);
        }

        [HttpGet("getUsersList/{id}")]
        public async Task<IActionResult> GetUserList(int id)
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

