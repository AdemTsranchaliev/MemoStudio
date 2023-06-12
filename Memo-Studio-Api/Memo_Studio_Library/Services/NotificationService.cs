using System;
namespace Memo_Studio_Library
{
    public class NotificationService : INotificationService
	{
        private readonly IMessageService messageService;
        private readonly IUserService userService;
        private readonly IBookingService bookingService;

        public NotificationService(IMessageService messageService, IUserService userService, IBookingService bookingService)
		{
            this.messageService = messageService;
            this.userService = userService;
            this.bookingService = bookingService;
        }

        public async Task SendNotifications()
        {
          
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
            if (reservationHour.Minute==0)
            {
                if (reservationHour.Year==currentHour.Year
                    && reservationHour.Month==currentHour.Month
                    && reservationHour.Day==currentHour.AddDays(1).Day
                    && reservationHour.Hour==currentHour.Hour)
                {
                    messageService.SendMessage(viberId,$"НАПОМНЯНЕ! \n Имате резервиран час за утре {reservationHour.ToShortTimeString}.");
                }
                else if (reservationHour.Year == currentHour.Year
                    && reservationHour.Month == currentHour.Month
                    && reservationHour.Day == currentHour.Day
                    && reservationHour.Hour == currentHour.AddHours(1).Hour)
                {
                    messageService.SendMessage(viberId, $"НАПОМНЯНЕ! \n Имате резервиран час за днес {reservationHour.ToShortTimeString}.");
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
                    messageService.SendMessage(viberId, $"НАПОМНЯНЕ! \n Имате резервиран час за утре {reservationHour.ToShortTimeString}.");
                }
                else if (reservationHour.Year == currentHour.Year
                    && reservationHour.Month == currentHour.Month
                    && reservationHour.Day == currentHour.Day
                    && reservationHour.Hour == currentHour.AddHours(1).Hour
                    && reservationHour.Minute == currentHour.Minute)
                {
                    messageService.SendMessage(viberId, $"НАПОМНЯНЕ! \n Имате резервиран час за днес {reservationHour.ToShortTimeString}.");
                }
            }
          
        }
    }
}

