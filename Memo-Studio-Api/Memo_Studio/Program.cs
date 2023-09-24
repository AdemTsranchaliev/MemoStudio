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
using Memo_Studio_Library.Services.Interfaces;
using Memo_Studio_Library.Data.Models;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;

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

        OperatingSystem os = System.Environment.OSVersion;

        if (os.Platform == PlatformID.Win32NT)
        {
                    builder.Services.AddDbContext<StudioContext>(options =>
            options.UseSqlServer(configuration.GetValue<string>("DbConnectionString-WIN")));
        }
        // Check if the operating system is macOS
        else if (os.Platform == PlatformID.Unix)
        {
                    builder.Services.AddDbContext<StudioContext>(options =>
            options.UseSqlServer(configuration.GetValue<string>("DbConnectionString-MAC")));
        }


        SetupAuthentication(builder.Services, configuration);

        builder.Services.AddControllers();

        builder.Services.AddCors(options => {
            options.AddPolicy("AllowAll",
                builder => {
                    builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });
        });

        //FOR NGROK FREE VERSION
        builder.Services.Configure<ForwardedHeadersOptions>(options => {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
        });

        RegisterServices(builder.Services);
        RegisterSwagger(builder.Services);

        builder.Services.AddHttpsRedirection(options => {
            options.HttpsPort = 5001;
        });

        builder.Services.AddViberBotApi(opt => {
            opt.Token = configuration.GetValue<string>("ViberToken");
            opt.Webhook = configuration.GetValue<string>("Webhook");
        });
        SeedData(builder.Services);

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
        services.AddSwaggerGen(options => {
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
            });

            // Add a global authorization requirement for the "Bearer" scheme
            options.AddSecurityRequirement(new OpenApiSecurityRequirement {
                {
                    new OpenApiSecurityScheme {
                        Reference = new OpenApiReference {
                            Type = ReferenceType.SecurityScheme,
                                Id = "Bearer",
                        },
                    },
                    new string[] {}
                },
            });
        });
    }

    public static void RegisterServices(IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IBookingService, BookingService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IDayService, DayService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IMessageService, MessageService>();
        services.AddScoped<IMailService, MailService>();
        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<IFacilityService, FacilityService>();
        services.AddAutoMapper(typeof(AutoMapperProfile));
    }

    public static void SetupAuthentication(IServiceCollection services, IConfiguration configuration)
    {
        services.AddIdentity<User, IdentityRole<int>>(op => {
            op.Password.RequiredLength = 6;
            op.Password.RequireUppercase = false;
            op.Password.RequiredUniqueChars = 0;
        })
            .AddEntityFrameworkStores<StudioContext>()
            .AddDefaultTokenProviders();

        services.AddAuthentication(options => {
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(x => {
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
    public static void SeedData(IServiceCollection services)
    {
        var serviceProvider = services.BuildServiceProvider();

        using (var context = new StudioContext(
            serviceProvider.GetRequiredService<DbContextOptions<StudioContext>>()))
        {
            if (!context.FacilityRoles.Any())
            {
                context.FacilityRoles.AddRange(
                    new FacilityRole
                    {
                        Name = "Admin"
                    },
                    new FacilityRole
                    {
                        Name = "Subscriber"
                    }
                );
                context.SaveChanges();
            }
            try
            {

                var facilities = new List<Facility>();
                var users = new User[5];
                if (!context.Users.Any())
                {
                    var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

                    users = new[] {
                    new User {
                        UserName = "user1",
                            Name = "Test User 1",
                            Email = "user1@test.com",
                            EmailConfirmed = true,
                            NormalizedEmail = "USER1@TEST.COM",
                            PhoneNumber = "0888888881",
                            NormalizedUserName = "USER1",
                            UserId = Guid.NewGuid()
                    },
                    new User {
                        UserName = "user2",
                            Name = "Test User 2",
                            Email = "user2@test.com",
                            EmailConfirmed = true,
                            NormalizedEmail = "USER2@TEST.COM",
                            PhoneNumber = "0888888882",
                            NormalizedUserName = "USER2",
                            UserId = Guid.NewGuid()
                    },
                    new User {
                        UserName = "user3",
                            Name = "Test User 3",
                            Email = "user3@test.com",
                            EmailConfirmed = true,
                            NormalizedEmail = "USER3@TEST.COM",
                            PhoneNumber = "0888888883",
                            NormalizedUserName = "USER3",
                            UserId = Guid.NewGuid()
                    },
                    new User {
                        UserName = "user4",
                            Name = "Test User 4",
                            Email = "user4@test.com",
                            EmailConfirmed = true,
                            NormalizedEmail = "USER4@TEST.COM",
                            PhoneNumber = "0888888884",
                            NormalizedUserName = "USER4",
                            UserId = Guid.NewGuid()
                    },
                    new User {
                        UserName = "user5",
                            Name = "Test User 5",
                            Email = "user5@test.com",
                            EmailConfirmed = true,
                            NormalizedEmail = "USER5@TEST.COM",
                            PhoneNumber = "0888888885",
                            NormalizedUserName = "USER5",
                            UserId = Guid.NewGuid()
                    },
                };

                    foreach (var user in users)
                    {
                        userManager.CreateAsync(user, "_Passw0rd").Wait();
                    }

                    var roleAdmin = context.FacilityRoles.FirstOrDefault(x => x.Name == "Admin");
                    var roleSubscriber = context.FacilityRoles.FirstOrDefault(x => x.Name == "Subscriber");

                    foreach (var user in users)
                    {
                        var facility = new Facility
                        {
                            Name = user.Name,
                            FacilityId = Guid.NewGuid(),
                            WorkingDays = "[{\"id\":1,\"day\":\"Monday\",\"isOpen\":true,\"openingTime\":\"08:00 AM\",\"closingTime\":\"06:00 PM\"},{\"id\":2,\"day\":\"Tuesday\",\"isOpen\":true,\"openingTime\":\"08:00 AM\",\"closingTime\":\"06:00 PM\"},{\"id\":3,\"day\":\"Wednesday\",\"isOpen\":false},{\"id\":4,\"day\":\"Thursday\",\"isOpen\":true,\"openingTime\":\"09:00 AM\",\"closingTime\":\"07:00 PM\"},{\"id\":5,\"day\":\"Friday\",\"isOpen\":true,\"openingTime\":\"09:00 AM\",\"closingTime\":\"08:00 PM\"},{\"id\":6,\"day\":\"Saturday\",\"isOpen\":true,\"openingTime\":\"10:00 AM\",\"closingTime\":\"08:00 PM\"},{\"id\":7,\"day\":\"Sunday\",\"isOpen\":false}]"
                        };
                        facilities.Add(facility);
                        foreach (var user2 in users)
                        {
                            if (user2 != user)
                            {
                                context.UserFalicities.Add(
                                    new UserFalicity
                                    {
                                        Facility = facility,
                                        UserId = user2.Id,
                                        FacilityRoleId = roleSubscriber.Id
                                    });
                            }
                            else
                            {
                                context.UserFalicities.Add(
                                    new UserFalicity
                                    {
                                        Facility = facility,
                                        UserId = user2.Id,
                                        FacilityRoleId = roleAdmin.Id
                                    });
                            }
                        }

                    }
                    context.SaveChanges();


                    foreach (var facility in facilities)
                    {
                        Random random = new Random();
                        int randomIndex = random.Next(0, users.Length);
                        int randomIndex2 = random.Next(0, users.Length);

                        var randomUser = users[randomIndex];
                        var randomUser2 = users[randomIndex];

                        var bookings = new List<Booking>
                {

                    new Booking
                    {
                        Timestamp = new DateTime(2023,9, 21, 8,30,0), // Set your timestamp
                        CreatedOn = DateTime.UtcNow, // Set your created on date
                        Canceled = false,
                        Duration = 30,
                        Note = "Booking 1 Note",
                        Confirmed = true,
                        RegisteredUser = true,
                        UserId = randomUser.Id,
                        FacilityId = facility.Id,
                    },
                    new Booking
                    {
                        Timestamp = new DateTime(2023,9, 21, 15,30,0),
                        CreatedOn = DateTime.UtcNow, // Set your created on date
                        Canceled = false,
                        Duration = 30,
                        Note = "Booking 2 Note",
                        Confirmed = true,
                        RegisteredUser = true,
                        UserId = randomUser.Id,
                        FacilityId = facility.Id
                    },
                };
                        context.Bookings.AddRange(bookings);
                    }
                    context.SaveChanges();
                }

                
                if (!context.Notifications.Any())
                {
                    var facilitiesList = context.Facilities.Take(5).ToList();
                    var facilityUsers = context.Users.Take(5).ToList();
                    foreach (var facility in facilitiesList)
                    {
                        Random random = new Random();
                        int randomIndex = random.Next(0, facilityUsers.Count());
                        var randomUser = facilityUsers[randomIndex];

                        var notifications = new Notification[]
                    {
                    new Notification
                    {
                        SentOn = DateTime.UtcNow,
                        Type = 1, // Set your notification type
                        Message = "Notification 1 Message",
                        BookingId = 1, // Set your BookingId
                        UserId = randomUser.Id, // Set your UserId
                        FacilityId = facility.Id, // Set your FacilityId
                    },
                    new Notification
                    {
                        SentOn = DateTime.UtcNow,
                        Type = 2, // Set your notification type
                        Message = "Notification 2 Message",
                        BookingId = 2, // Set your BookingId
                        UserId = randomUser.Id, // Set your UserId
                        FacilityId = facility.Id,
                    },
                        // Add more Notification records as needed
                    };

                    context.Notifications.AddRange(notifications);
                    context.SaveChanges();
                }

                }
            }
            catch (Exception ex)
            {
                int i = 0;
            }
        }
    }

}