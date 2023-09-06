﻿using System;
using Memo_Studio_Library;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        public UserController(IUserService userService, UserManager<User> userManager, SignInManager<User> signInManager, StudioContext context)
        {
            this.userService = userService;
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

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            try
            {
                var user = new User {
                    UserName = model.Email,
                    Email = model.Email,
                    Name = model.Name,
                    NormalizedUserName = model.Email,
                    NormalizedEmail = model.Email.ToLower(),
                    PhoneNumber = model.Phone                   
                };
                var result = await userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    return Ok();
                }

                return BadRequest();
            }
            catch (Exception ex)
            {

                return BadRequest();

            }

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

