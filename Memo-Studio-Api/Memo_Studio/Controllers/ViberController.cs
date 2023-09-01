using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Viber.Bot.NetCore.Infrastructure;
using Viber.Bot.NetCore.Models;
using Viber.Bot.NetCore.RestApi;

namespace Controller.Viber
{
    [Route("api/[controller]")]
    [ApiController]
    public class ViberController : ControllerBase
    {
        private readonly IViberBotApi _viberBotApi;

        public ViberController(IViberBotApi viberBotApi)
        {
            _viberBotApi = viberBotApi;
        }

        // The service sets a webhook automatically, but if you want sets him manually then use this
        [Authorize]
        [HttpGet("getData")]
        public async Task<IActionResult> Get()
        {
            var response = await _viberBotApi.SetWebHookAsync(new ViberWebHook.WebHookRequest("YOUR_WEBHOOK_URL"));

            if (response.Content.Status == ViberErrorCode.Ok)
            {
                return Ok("Viber-bot is active");
            }
            else
            {
                return BadRequest(response.Content.StatusMessage);
            }
        }

        [Authorize]
        [HttpPost("postData")]
        public async Task<IActionResult> Post()
        {
            var str = String.Empty;

            // you should to control required fields
            var message = new ViberMessage.TextMessage()
            {
                //required
                //Receiver = "wsM3/s4QKDDx4ZUg1qdzpQ==",
                Receiver = "K+P+w8r6NtEHor2JcsBzpQ==",
                Sender = new ViberUser.User()
                {
                    //required
                    Name = "Memo studio",
                    Avatar = "http://dl-media.viber.com/1/share/2/long/bots/generic-avatar%402x.png"
                },
                //required
                Text = "Hello, Adem"
            };

            // our bot returns incoming text
            var response = await _viberBotApi.SendMessageAsync<ViberResponse.SendMessageResponse>(message);

            return Ok();
        }
    }
}