using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.IO;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using Memo_Studio_Library;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WebhookController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly IMessageService messageService;

        public WebhookController(IUserService userService, IMessageService messageService)
        {
            this.userService = userService;
            this.messageService = messageService;
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
                        var responseOne = messageService.SendMessage(userViberId, "Здравейте, вие се абонирахте за канала от който ще получавате напомняния за резервираните си часове.\nМоля въведете вашето име и фамилия,\nНА КИРИЛИЦА(пример \"Иван Иванов\").");
                        System.Console.WriteLine($"Greeting response: {responseOne}");
                    }

                }
                else if (data["event"] == "message")
                {
                    var userViberId = data["sender"]["id"].Value;
                    var message = data["message"]["text"].Value;
                    var user = userService.GetUserByViberId(userViberId);

                    if (user!=null)
                    {
                        var model = new UserViewModel
                        {
                            ViberId = userViberId,
                            Phone=user.Phone,
                            Name=user.Name
                        };

                        if (user.Name==null)
                        {
                            bool isValidFullName = ValidateName(message);

                            if (isValidFullName)
                            {
                                model.Name = message;
                                var isUserExist = userService.AddUser(model);

                                var responseName = messageService.SendMessage(userViberId, "Моля въведете вашия телефонен номер, започващ с '0', а не с '+359'(пример \"0892693877\")");
                                System.Console.WriteLine($"Name response: {responseName} - {message}");

                            }
                            else
                            {
                                var responseNameError = messageService.SendMessage(userViberId, "Грешен формат! Моля опитайте отново. (пример \"Иван Иванов\")");
                                System.Console.WriteLine($"Name response: {responseNameError} - {message}");
                            }

                        }
                        else if (user.Phone == null)
                        {
                            bool isValidPhone = ValidatePhoneNumber(message);

                            if (isValidPhone)
                            {
                                model.Phone = message;
                                var isUserExist = userService.AddUser(model);
                                var endMessage = messageService.SendMessage(userViberId, $"Благодаря Ви, {user.Name}. Успешно завършихте регистрацията си.");
                                System.Console.WriteLine($"Name response: {endMessage} - {message}");
                            }
                            else
                            {
                                var endMessageError = messageService.SendMessage(userViberId, "Грешен формат! Моля опитайте отново. (пример \"0892693877\")");
                                System.Console.WriteLine($"Name response: {endMessageError} - {message}");
                            }

                        }
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
