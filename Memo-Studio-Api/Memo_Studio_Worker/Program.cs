﻿using Memo_Studio_Library;
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
                    opt.Token = "512bedc7fea7e251-de5bb717e76c1d0e-d34a8a161a86d483";
                    opt.Webhook = "https://6e4e-149-62-209-254.ngrok-free.app/Webhook";
                });
            })
            .Build();

        host.Run();
    }
}