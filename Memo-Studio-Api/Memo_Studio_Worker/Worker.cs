using System.Globalization;
using Memo_Studio_Library;
using Memo_Studio_Library.Models;

namespace Memo_Studio_Worker;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IMessageService messageService;
    private readonly IUserService userService;
    private readonly IBookingService bookingService;


    public Worker(ILogger<Worker> logger, IMessageService messageService, IUserService userService, IBookingService bookingService)
    {
        this.messageService = messageService;
        this.userService = userService;
        this.bookingService = bookingService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await SendNotifications();
    }


    public async Task SendNotifications()
    {
        while (true)
        {
            var currentTime = DateTime.Now;

            var bookings = bookingService
                .GetBookingsByRange(currentTime, currentTime.AddDays(1))
                .OrderBy(x=>x.Timestamp)
                .GroupBy(x=>x.ReservationId)
                .ToDictionary(x=>x.Key,x=>x.ToList().FirstOrDefault());
            foreach (var booking in bookings)
            {
                if (booking.Value!=null)
                {
                    CompareHours(booking.Value.Timestamp, currentTime, booking.Value.User.ViberId, booking.Value.User.Name);
                }
            }
            var delay = (int)GetDelayUntilNextRoundHalfHour(currentTime).TotalMilliseconds;
            await Task.Delay(delay);
        }
    }

    private TimeSpan GetDelayUntilNextRoundHour(DateTime currentTime)
    {
        DateTime nextRoundHour = currentTime.Date.AddHours(currentTime.Hour + 1);

        if (nextRoundHour <= currentTime)
            nextRoundHour = nextRoundHour.AddHours(1);

        TimeSpan delay = nextRoundHour - currentTime;

        return delay;
    }

    private TimeSpan GetDelayUntilNextRoundHalfHour(DateTime currentTime)
    {
        DateTime nextHalfHour;

        if (currentTime.Minute < 30)
        {
            nextHalfHour = currentTime.Date.AddHours(currentTime.Hour).AddMinutes(30);
        }
        else
        {
            nextHalfHour = currentTime.Date.AddHours(currentTime.Hour + 1);
        }

        TimeSpan delay = nextHalfHour - currentTime;

        return delay;
    }


    private void CompareHours(DateTime reservationHour, DateTime currentHour, string viberId, string name)
    {

        CultureInfo culture = new CultureInfo("bg-BG");

        // Parse the datetime string with the specified format and culture
        string day = reservationHour.ToString("dd");
        string month = culture.DateTimeFormat.GetMonthName(reservationHour.Month);
        string year = reservationHour.ToString("yyyy");
        string weekday = culture.DateTimeFormat.GetDayName(reservationHour.DayOfWeek);
        var hour = reservationHour.Hour <= 10 ? $"0{reservationHour.Hour}" : reservationHour.Hour.ToString();
        var minutes = reservationHour.Minute <= 10 ? $"0{reservationHour.Minute}" : reservationHour.Minute.ToString();

        var date = $"*$({hour}:{minutes}ч.) - {weekday}, {day} {month} {year}г.*";
        if (reservationHour.Minute == 0)
        {
            if (reservationHour.Year == currentHour.Year
                && reservationHour.Month == currentHour.Month
                && reservationHour.Day == currentHour.AddDays(1).Day
                && reservationHour.Hour == currentHour.Hour
                && reservationHour.Minute == currentHour.Minute)          
            {
                Console.WriteLine($"{name} - НАПОМНЯНЕ! \nИмате резервиран час за утре {date}.");
                messageService.SendMessage(viberId, $"НАПОМНЯНЕ! \nИмате резервиран час за утре {date}.");
            }
            else if (reservationHour.Year == currentHour.Year
                && reservationHour.Month == currentHour.Month
                && reservationHour.Day == currentHour.Day
                && reservationHour.Hour == currentHour.AddHours(2).Hour
                && reservationHour.Minute == currentHour.Minute)          
            {
                Console.WriteLine($"{name} - НАПОМНЯНЕ! \nИмате резервиран час за днес {date}.");

                messageService.SendMessage(viberId, $"НАПОМНЯНЕ! \nИмате резервиран час за днес {date}.");
            }
        }
        else
        {
            if (reservationHour.Year == currentHour.Year
                && reservationHour.Month == currentHour.Month
                && reservationHour.Day == currentHour.AddDays(1).Day
                && reservationHour.Hour == currentHour.Hour
                && reservationHour.Minute == currentHour.Minute)
            {
                Console.WriteLine($"{name} - НАПОМНЯНЕ! \nИмате резервиран час за утре {date}.");

                messageService.SendMessage(viberId, $"НАПОМНЯНЕ! \nИмате запазен час за утре {date}.");
            }
            else if (reservationHour.Year == currentHour.Year
                && reservationHour.Month == currentHour.Month
                && reservationHour.Day == currentHour.Day
                && reservationHour.Hour == currentHour.AddHours(2).Hour
                && reservationHour.Minute == currentHour.Minute)
            {
                Console.WriteLine($"{name} - НАПОМНЯНЕ! \nИмате резервиран час за днес {date}.");

                messageService.SendMessage(viberId, $"НАПОМНЯНЕ! \nИмате резервиран час за днес {date}.");
            }
        }

    }
}

