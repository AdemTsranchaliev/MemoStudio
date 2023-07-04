
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;
using Viber.Bot.NetCore.Middleware;
using Microsoft.EntityFrameworkCore;
using Memo_Studio_Library;
using Microsoft.Extensions.Configuration;
using Memo_Studio_Library.Services;

namespace Memo_Studio;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(builder.Environment.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .Build();

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
        builder.Services.AddSingleton<IUserService, UserService>();
        builder.Services.AddSingleton<IBookingService, BookingService>();
        builder.Services.AddSingleton<INotificationService, NotificationService>();
        builder.Services.AddSingleton<IDayService, DayService>();

        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
        });
        builder.Services.AddSingleton<IMessageService, MessageService>();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddHttpsRedirection(options =>
        {
            options.HttpsPort = 5001;
        });
        builder.Services.AddViberBotApi(opt =>
        {
            opt.Token = configuration.GetValue<string>("ViberToken");
            opt.Webhook = configuration.GetValue<string>("Webhook");
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

