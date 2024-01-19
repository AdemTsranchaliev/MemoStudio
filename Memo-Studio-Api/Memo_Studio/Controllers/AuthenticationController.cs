using Memo_Studio_Library;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.Services;
using Memo_Studio_Library.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Memo_Studio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly ITokenService tokenService;
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;

        public AuthenticationController(IUserService userService, ITokenService tokenService, UserManager<User> userManager, SignInManager<User> signInManager)
		{
            this.userService = userService;
            this.tokenService = tokenService;
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Authenticate([FromBody] AuthenticateViewModel model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.Email))
                {
                    throw new ArgumentNullException("Моля попълнете всички полета");
                }

                var user = await userService.GetUserByEmailAsync(model.Email);

                if (user == null)
                {
                    return new NotFoundResult();
                }
                if (!user.EmailConfirmed)
                {
                    throw new ArgumentException("Имейлът ви не е потвърден. Моля проверете имейла си и го потвърдете");
                }

                var result = await signInManager.CheckPasswordSignInAsync(user, model.Password, false);
                if (result.Succeeded)
                {
                    var token = tokenService.GenerateBearerToken(user);
                    return Ok(token);
                }
                else
                {
                    throw new ArgumentException("Паролата или имейлът са невалидни");
                }
            }
            catch (ArgumentException ex)
            {
                throw new ArgumentException(ex.Message);
            }
            catch (Exception ex)
            {
                throw new ArgumentException("Сървърна грешка 500, моля свържете се с поддръжката");
            }
        }
	}
}

