
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
            options.AddPolicy(
                "CorsPolicy",
      builder => builder.WithOrigins("http://localhost:4200", "https://memostudio.000webhostapp.com")
      .AllowAnyMethod()
      .AllowAnyHeader()
      .AllowCredentials());
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
            options.HttpsPort = 7190;

        });
        builder.Services.AddViberBotApi(opt =>
        {
            opt.Token = "512c41111627e49d-d86abfc91904aa48-2c9327d9896269e6";
            opt.Webhook = "https://0cad-89-215-182-166.ngrok-free.app/Webhook";
        });
        var app = builder.Build();
        app.UseCors("AllowAll");
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


        app.MapControllers();

        app.Run();
    }
}

