using Microsoft.AspNetCore.HttpOverrides;
using Viber.Bot.NetCore.Middleware;
using Memo_Studio_Library;
using Memo_Studio_Library.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Memo_Studio_Library.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

namespace Memo_Studio;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var enviorment = builder.Environment.EnvironmentName;

        IConfiguration configuration = new ConfigurationBuilder()
          .SetBasePath(builder.Environment.ContentRootPath)
          .AddJsonFile($"appsettings.{enviorment}.json", optional: true, reloadOnChange: true)
          .Build();

        builder.Services.AddDbContext<StudioContext>(options =>
          options.UseSqlServer(configuration.GetValue<string>("JwtSettings:DbConnectionString-MAC")));

        SetupAuthentication(builder.Services, configuration);

        builder.Services.AddControllers();

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

        //FOR NGROK FREE VERSION
        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
        });

        RegisterServices(builder.Services);
        RegisterSwagger(builder.Services);

        builder.Services.AddHttpsRedirection(options =>
        {
            options.HttpsPort = 5001;
        });

        builder.Services.AddViberBotApi(opt =>
        {
            opt.Token = configuration.GetValue<string>("ViberToken");
            opt.Webhook = configuration.GetValue<string>("Webhook");
        });


        //APP REG
        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseForwardedHeaders();

        app.UseCors("AllowAll");

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }

    public static void RegisterSwagger(IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
            });

            // Add a global authorization requirement for the "Bearer" scheme
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer",
                    },
                },
                new string[] { }
            },
        });
        });
    }

    public static void RegisterServices(IServiceCollection services)
    {
        services.AddSingleton<IUserService, UserService>();
        services.AddSingleton<IBookingService, BookingService>();
        services.AddSingleton<INotificationService, NotificationService>();
        services.AddSingleton<IDayService, DayService>();
        services.AddSingleton<ITokenService, TokenService>();
        services.AddSingleton<IMessageService, MessageService>();
    }

    public static void SetupAuthentication(IServiceCollection services, IConfiguration configuration)
    {
        services.AddIdentity<User, IdentityRole>(op =>
        {
            op.Password.RequiredLength = 6;
            op.Password.RequireUppercase = false;
            op.Password.RequiredUniqueChars = 0;
        })
          .AddEntityFrameworkStores<StudioContext>()
          .AddDefaultTokenProviders();

        services.AddAuthentication(options =>
        {
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(x =>
        {
            x.RequireHttpsMetadata = false;
            x.TokenValidationParameters = new TokenValidationParameters
            {
                ValidIssuer = configuration.GetValue<string>("JwtSettings:Issuer"),
                ValidAudience = configuration.GetValue<string>("JwtSettings:Audience"),
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetValue<string>("JwtSettings:Key"))),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
            };
        });
    }

}