using Memo_Studio_Library;
using Viber.Bot.NetCore.Middleware;

namespace Memo_Studio_Worker;

public class Program
{
    public static void Main(string[] args)
    {
        IHost host = Host.CreateDefaultBuilder(args)
            .ConfigureServices(services =>
            {
                services.AddHostedService<Worker>();
                services.AddSingleton<IBookingService, BookingService>();
                services.AddSingleton<IUserService, UserService>();
                services.AddSingleton<INotificationService, NotificationService>();
                services.AddSingleton<IMessageService, MessageService>();
                services.AddViberBotApi(opt =>
                {
                    opt.Token = "512c41111627e49d-d86abfc91904aa48-2c9327d9896269e6";
                    opt.Webhook = "https://7b31-89-215-182-166.ngrok-free.app/Webhook";
                });
            })
            .Build();

        host.Run();
    }
}
