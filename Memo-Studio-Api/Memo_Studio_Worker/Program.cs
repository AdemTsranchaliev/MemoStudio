using Memo_Studio_Library;
using Microsoft.EntityFrameworkCore;
using Viber.Bot.NetCore.Middleware;

namespace Memo_Studio_Worker;

public class Program
{
    public static void Main(string[] args)
    {
        IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .Build();

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

                    opt.Token = configuration.GetValue<string>("ViberToken");
                    opt.Webhook = configuration.GetValue<string>("Webhook");
                });
            })
            .Build();

        host.Run();
    }
}
