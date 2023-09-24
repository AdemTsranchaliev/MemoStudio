using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Viber.Bot.NetCore.Models;
using Viber.Bot.NetCore.RestApi;

namespace Memo_Studio_Library
{
    public class MessageService: IMessageService
	{
        private readonly IViberBotApi viberBotApi;

        public MessageService(IViberBotApi viberBotApi)
        {
            this.viberBotApi = viberBotApi;
        }

        public async Task SendMessage(string viberId, string message)
        {
            var messageObj = new ViberMessage.TextMessage()
            {
                Receiver = viberId,
                Sender = new ViberUser.User()
                {
                    Name = "Memo studio",
                    Avatar = "http://dl-media.viber.com/1/share/2/long/bots/generic-avatar%402x.png"
                },
                Text = message
            };  

            var response = await viberBotApi.SendMessageAsync<ViberResponse.SendMessageResponse>(messageObj);
        }
    }
}

