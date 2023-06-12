using Memo_Studio_Library;

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

            var bookings = bookingService.GetBookingsByRange(currentTime, currentTime.AddDays(1));

            foreach (var booking in bookings)
            {
                CompareHours(booking.Timestamp,currentTime, booking.User.ViberId);
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


    private void CompareHours(DateTime reservationHour, DateTime currentHour, string viberId)
    {
        var t = $"НАПОМНЯНЕ! \n Имате резервиран час за утре, {reservationHour.ToString("yyyy-MM-dd в HH:mm")}.";
        if (reservationHour.Minute == 0)
        {
            if (reservationHour.Year == currentHour.Year
                && reservationHour.Month == currentHour.Month
                && reservationHour.Day == currentHour.AddDays(1).Day
                && reservationHour.Hour == currentHour.Hour
                && reservationHour.Minute == currentHour.Minute)          
            {
                messageService.SendMessage(viberId, $"НАПОМНЯНЕ! \n Имате резервиран час за утре {reservationHour.ToString("yyyy-MM-dd HH:mm")}.");
            }
            else if (reservationHour.Year == currentHour.Year
                && reservationHour.Month == currentHour.Month
                && reservationHour.Day == currentHour.Day
                && reservationHour.Hour == currentHour.AddHours(1).Hour
                && reservationHour.Minute == currentHour.Minute)          
            {
                messageService.SendMessage(viberId, $"НАПОМНЯНЕ! \n Имате резервиран час за днес {reservationHour.ToString("yyyy-MM-dd HH:mm")}.");
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
                messageService.SendMessage(viberId, $"НАПОМНЯНЕ! \n Имате резервиран час за утре {reservationHour.ToString("yyyy-MM-dd HH:mm")}.");
            }
            else if (reservationHour.Year == currentHour.Year
                && reservationHour.Month == currentHour.Month
                && reservationHour.Day == currentHour.Day
                && reservationHour.Hour == currentHour.AddHours(1).Hour
                && reservationHour.Minute == currentHour.Minute)
            {
                messageService.SendMessage(viberId, $"НАПОМНЯНЕ! \n Имате резервиран час за днес {reservationHour.ToString("yyyy-MM-dd HH:mm")}.");
            }
        }

    }
}

