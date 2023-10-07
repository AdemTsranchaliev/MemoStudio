using System.Text.RegularExpressions;
using Memo_Studio_Library;
using Memo_Studio_Library.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WebhookController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly IMessageService messageService;
        private readonly IViberService viberService;

        public WebhookController(IUserService userService, IMessageService messageService, IViberService viberService)
        {
            this.userService = userService;
            this.messageService = messageService;
            this.viberService = viberService;
        }
        [HttpPost]
        public async Task<IActionResult> Post()
        {
            using (StreamReader reader = new StreamReader(Request.Body))
            {
                string requestBody = await reader.ReadToEndAsync();

                // Deserialize the incoming JSON data
                dynamic data = JsonConvert.DeserializeObject(requestBody);

                if (data["event"] == "conversation_started" || data["event"] == "subscribed")
                {
                    var userViberId = data["user"]["id"].Value;

                    var model = new UserViewModel
                    {
                        ViberId = userViberId
                    };

                    var isUserExist = userService.AddUser(model);

                    if (!isUserExist)
                    {
                        var responseOne = messageService.SendMessage(userViberId, "Моля въведете вашето име и фамилия,\nНА КИРИЛИЦА(пример \"Иван Иванов\").");
                        System.Console.WriteLine($"Greeting response: {responseOne}");
                    }

                }
                else if (data["event"] == "message")
                {
                    var userViberId = data["sender"]["id"].Value;
                    var message = data["message"]["text"].Value;

                    var user = userService.GetUserByViberId(userViberId);

                    if (user == null)
                    {
                        var result = await viberService.ValidateConfirmationCode(message, userViberId);

                        await messageService.SendMessage(userViberId,"Успешно свръзахте вашия вайбър с вашия профил. Вече ще получавате вашите напомняния тук.");
                    }

                }
            }

            return Ok();
        }

        private bool ValidateName(string name)
        {
            name = name.ToLower();
            string pattern = @"^[а-я]+\s[а-я]+$";
            return Regex.IsMatch(name, pattern);
        }
        private bool ValidatePhoneNumber(string phoneNumber)
        {
            string pattern = @"^08[7-9]\d{7}$";
            return Regex.IsMatch(phoneNumber, pattern);
        }
    }
}
