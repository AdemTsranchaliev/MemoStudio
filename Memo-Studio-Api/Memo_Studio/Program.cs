
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;
using Viber.Bot.NetCore.Middleware;
using Microsoft.EntityFrameworkCore;
using Memo_Studio_Library;

namespace Memo_Studio;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();

        //builder.Services.AddDbContext<StudioContext>(options =>
         //  options.UseSqlServer("Server=tcp:127.0.0.1,1433;Database=MemoStudio;MultipleActiveResultSets=true;User=sa;Password=MyPass@word;"));

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll",
                builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
        });
        builder.Services.AddSingleton<IUserService,UserService>();
        builder.Services.AddSingleton<IBookingService,BookingService>();
        builder.Services.AddSingleton<INotificationService, NotificationService>();

        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
        });
        builder.Services.AddSingleton<IMessageService,MessageService>();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddHttpsRedirection(options =>
        {
            options.HttpsPort = 5001;
        });
        builder.Services.AddViberBotApi(opt =>
        {
            opt.Token = "50f5951012e7e48f-8318392dd0b0ce5b-7c207c81f387276d";
            opt.Webhook = "https://6e4e-149-62-209-254.ngrok-free.app/Webhook";
        });
        var app = builder.Build();
        // Configure the HTTP request pipeline.

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        //app.UseHsts();
        

        app.UseHttpsRedirection();
        app.UseForwardedHeaders();
        app.UseAuthorization();
        app.UseCors("AllowAll");


        app.MapControllers();

        app.Run();
    }
}

