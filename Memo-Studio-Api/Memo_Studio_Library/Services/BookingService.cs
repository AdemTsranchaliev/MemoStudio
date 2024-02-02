using AutoMapper;
using Memo_Studio_Library.Data.Models;
using Memo_Studio_Library.Enums;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.Services.Interfaces;
using Memo_Studio_Library.ViewModels.Booking;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;

namespace Memo_Studio_Library
{
    public class BookingService : IBookingService
	{
        private readonly StudioContext context;
        private readonly IFacilityService facilityService;
        private readonly IUserService userService;
        private readonly IMessageService messageService;
        private readonly IMailService mailService;
        private readonly IMapper mapper;

        public BookingService(StudioContext context, IFacilityService facilityService,IUserService userService, IMessageService messageService, IMailService mailService, IMapper mapper)
		{
            this.context = context;
            this.facilityService = facilityService;
            this.userService = userService;
            this.messageService = messageService;
            this.mailService = mailService;
            this.mapper = mapper;
        }

        public async Task AddBookign(BookingViewModel booking)
        {
            var facility = await facilityService.GetFacilityById(booking.FacilityId);

            if (facility==null)
            {
                throw new Exception("");
            }

            var newBooking = new Booking
            {
                CreatedOn = DateTime.Now,
                Timestamp = booking.Timestamp,
                FacilityId = facility.Id,
                Note = booking.Note,
                Duration = booking.Duration,
                OwnerReservation = true,
                ServiceId = booking.ServiceId,
                BookingId = Guid.NewGuid()
            };

            try
            {
                var dateToSearch = booking.Timestamp;

                if (booking?.UserId != null)
                {
                    var user = await userService.GetUserById(booking.UserId.Value);

                    newBooking.UserId = user.Id;
                }
                else
                {
                    newBooking.SetUnregisteredUser(booking?.Name, booking?.Email, booking?.Phone);
                }

                var result = await context.Bookings.AddAsync(newBooking);

                var saveResult = await context.SaveChangesAsync();

                if (saveResult>0)
                {
                    context.Entry(result.Entity).Reference(b => b.User).Load();
                    context.Entry(result.Entity).Reference(b => b.Facility).Load();
                    context.Entry(result.Entity).Reference(b => b.Service).Load();

                    var dateString = result.Entity.GetDateTimeInMessageFormat();

                    if (result.Entity?.User!=null)
                    {
                        mailService.Send(result.Entity?.User.Email!, "", "Запазихте нов час", $"Запазихте час за \n{dateString}","test","test");
                    }
                    else
                    {
                        var mailSubject = GetSubject(result);
                        var message = GetEmailContent(result);
                        mailService.Send(booking.Email!, "", mailSubject, message, "", "");
                    }
                    if (result.Entity?.User?.ViberId != null)
                    {
                        await messageService.SendMessage(result.Entity.User.ViberId, $"Запазихте час за \n{dateString}");
                    }
                }
                else
                {
                    throw new Exception("Грешка при запазването на данните. Моля опитайте отново");
                }

            }
            catch
            {
                throw new Exception("Грешка при запазването на данните. Моля опитайте отново");
            }
        }

        public async Task<BookingListViewModel> GetBookingsListByDate(DateTime dateTime, Guid facilityId)
        {
            using (var context = new StudioContext())
            {
                try
                {
                    var facility = await context.Facilities
                        .Include(x => x.Days)
                        .Include(x => x.Bookings)
                        .FirstOrDefaultAsync(x => x.FacilityId == facilityId);

                    if (facility == null)
                    {
                        return new BookingListViewModel { IsOpen = false };
                    }

                    var tuple = GetTimeSlots(facility, dateTime);

                    var start = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, 0, 0, 0, DateTimeKind.Utc);
                    var end = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, 23, 59, 59, DateTimeKind.Utc);

                    var currentUtcDate = DateTime.UtcNow;
                    var roundDate = new DateTime(currentUtcDate.Year,currentUtcDate.Month,currentUtcDate.Day,0,0,0, DateTimeKind.Utc);

                    var bookings = facility.Bookings
                        .Where(x => x.Timestamp >= start && x.Timestamp <= end && x.Facility.FacilityId == facilityId && !x.Canceled)
                        .ToList();

                    var result = new List<BookingsResponceViewModel>();
                    if (roundDate <= start)
                    {

                        foreach (var slot in tuple.Item2)
                        {
                            var roundHour = GetHourAndMinutes(slot);
                            var booking = bookings
                                .FirstOrDefault(x => GetHourAndMinutes(x.Timestamp.AddMinutes(x.Duration)) > roundHour && GetHourAndMinutes(x.Timestamp) <= roundHour && !x.Canceled);

                            if (booking != null)
                            {
                                var mappedValue = mapper.Map<BookingsResponceViewModel>(booking);
                                mappedValue.Timestamp = slot;
                                mappedValue.IsFree = false;
                                result.Add(mappedValue);
                            }
                            else
                            {
                                var freeHour = new BookingsResponceViewModel(slot);
                                result.Add(freeHour);
                            }
                        }
                    }
                    else
                    {
                        foreach (var booking in bookings)
                        {
                            var mappedValue = mapper.Map<BookingsResponceViewModel>(booking);
                            mappedValue.IsFree = false;
                            result.Add(mappedValue);
                        }
                    }

                    return new BookingListViewModel { IsOpen = tuple.Item1, Bookings = result};
                }
                catch (Exception ex)
                {
                    return null;
                }
            }

        }

        public async Task<List<Booking>> GetBookingsByDate(DateTime dateTime, Guid facilityId)
        {
            using (var context = new StudioContext())
            {
                try {
                    var start = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, 0, 0, 0, DateTimeKind.Utc);
                    var end = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, 23, 59, 59, DateTimeKind.Utc);

                    return await context.Bookings
                        .Include(x => x.Facility)
                        .Where(x => x.Timestamp >= start && x.Timestamp <= end && x.Facility.FacilityId == facilityId && !x.Canceled)
                        //.Include(x => x.User)
                        .ToListAsync();
                }
                catch (Exception ex) {
                    int i = 0;
                    return null;
                }
            } 

        }

        public List<Booking> GetBookingsByRange(DateTime periodStart, DateTime periodEnd)
        {
            try
            {
                using (var context = new StudioContext())
                {
                    if (periodStart > periodEnd)
                    {
                        return new List<Booking>();
                    }
                    return context.Bookings
                        .Include(x => x.User)
                        .Where(x => x.Timestamp >= periodStart && x.Timestamp <= periodEnd && !x.Canceled).ToList();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            
        }

        public async Task<Booking> RemoveBooking(Guid bookingId, Guid facilityId)
        {
            using (var context = new StudioContext())
            {              
                var booking = await context
                    .Bookings
                    .Include(x => x.Facility)
                    .FirstOrDefaultAsync(x=>x.Facility.FacilityId==facilityId && x.BookingId == bookingId);

                if (booking == null)
                {
                    return null;
                }

                booking.Canceled = true;

                context.Bookings.Update(booking);
                await context.SaveChangesAsync();

                return booking;
            }
        }

        public async Task<string> GetViberIdByBookingId(int id)
        {
            using (var context = new StudioContext())
            {
                var booking = await context.Bookings
                     .Include(x => x.User)
                     .FirstOrDefaultAsync(x=>x.Id==id);

                if (booking == null || booking.User == null || booking.User.ViberId == null)
                {
                    return null;
                }

                return booking.User.ViberId;
            }
        }

        public async Task<Booking> GetBookingByBookingId(int id)
        {
            using (var context = new StudioContext())
            {
                var booking = await context.Bookings
                     .Include(x => x.User)
                     .FirstOrDefaultAsync(x => x.Id == id);

                if (booking == null || booking.User == null || booking.Canceled)
                {
                    return null;
                }

                return booking;
            }
        }

        public async Task<List<MonthDaysStatisticsResponse>> GetMonthDaysStatistics(Guid facilityId, int month, int year)
        {
            var result = new List<MonthDaysStatisticsResponse>();

            var facility = await context.Facilities
                 .FirstOrDefaultAsync(x => x.FacilityId == facilityId);

            var customDaysForFacility = await context.Days
                .Include(x=>x.Facility)
                .Where(x => x.DayDate.Month == month && x.DayDate.Year == year && x.Facility.FacilityId == facilityId)
                .ToListAsync();


            var bookings = await context.Bookings
                .Include(x => x.Facility)
                .Where(x => x.Timestamp.Month == month && x.Timestamp.Year == year && x.Facility.FacilityId == facilityId)
                .ToListAsync();

            if (facility == null)
            {
                return result;
            }

            var businessHours = JsonConvert.DeserializeObject<List<BusinessHoursViewModel>>(facility.WorkingDays);

            var daysInMonth = DateTime.DaysInMonth(year, month);
            var nowTime = DateTime.Now;
            for (int dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++)
            {
                if (year< nowTime.Year || month< nowTime.Month || (dayOfMonth < nowTime.Day && month==nowTime.Month&&year==nowTime.Year))
                {
                    result.Add(new MonthDaysStatisticsResponse(dayOfMonth, (int)DayStatusEnum.Past));
                    continue;
                }
                DateTime currentDate = new DateTime(year, month, dayOfMonth, 0, 0 ,0, DateTimeKind.Utc);
                var dayOfWeek = currentDate.DayOfWeek;

                var customDay = customDaysForFacility.FirstOrDefault(x => x.DayDate.Day == dayOfMonth);

                if (customDay != null)
                {
                    if (!customDay.IsOpen)
                    {
                        result.Add(new MonthDaysStatisticsResponse(dayOfMonth, (int)DayStatusEnum.Closed));
                    }
                    else
                    {
                        var bookingsForDay = bookings.Where(x => x.Timestamp.Day == dayOfMonth).ToList();

                        var intervalCount = CalculateIntervalCount(customDay.StartPeriod, customDay.EndPeriod, customDay.Interval);

                        if (bookingsForDay.Count() == intervalCount)
                        {
                            result.Add(new MonthDaysStatisticsResponse(dayOfMonth, (int)DayStatusEnum.Full));
                        }
                        else
                        {
                            result.Add(new MonthDaysStatisticsResponse(dayOfMonth, (int)DayStatusEnum.Open));
                        }
                    }
                }
                else
                {
                    var idOfWeekDay = (int)dayOfWeek == 0 ? 7 : (int)dayOfWeek;
                    var bussinessDay = businessHours.FirstOrDefault(x => x.Id == idOfWeekDay);

                    if (bussinessDay!=null&&!bussinessDay.IsOpen)
                    {
                        result.Add(new MonthDaysStatisticsResponse(dayOfMonth,(int)DayStatusEnum.Closed));
                    }
                    else
                    {
                        var bookingsForDay = bookings.Where(x => x.Timestamp.Day == dayOfMonth).ToList();

                        var intervalCount = CalculateIntervalCount(facility.StartPeriod, facility.EndPeriod, facility.Interval);

                        if (bookingsForDay.Count() == intervalCount)
                        {
                            result.Add(new MonthDaysStatisticsResponse(dayOfMonth, (int)DayStatusEnum.Full));
                        }
                        else
                        {
                            result.Add(new MonthDaysStatisticsResponse(dayOfMonth, (int)DayStatusEnum.Open));
                        }
                    }
                }
            }


            return result;

        }

        public async Task<List<Booking>> GetBookingByReservationId(string id)
        {
            using (var context = new StudioContext())
            {
                var bookings = await context.Bookings
                     //.Where(x => x.ReservationId == id)
                     .ToListAsync();             

                return bookings;
            }
        }

        private int CalculateIntervalCount(DateTime startTime, DateTime endTime, int intervalMinutes)
        {
            if (intervalMinutes==0)
            {
                intervalMinutes = 30;
            }
            int totalMinutes = (int)(endTime - startTime).TotalMinutes;

            var intervalCount = totalMinutes / intervalMinutes;

            return intervalCount;
        }

        private string GetSubject(EntityEntry<Booking> booking)
        {
            return $"Потвърждение за Резервация: Студио '{booking.Entity.Facility.Name}'";
        }

        private string GetEmailContent(EntityEntry<Booking> booking)
        {
            var bookingDate = booking.Entity.GetDateTimeInMessageFormat();
            var category = booking.Entity.ServiceId != null ? "за "+booking.Entity?.Service.Name+" " : "";
            return $"<p>Здравейте <b>{booking.Entity.Name}</b>,</p>\n\n<p>Благодарим ви, че използвахте нашето приложение за вашата резервация. Вашата резервация {category}в студио <b>'{booking.Entity.Facility.Name}'</b> е успешно потвърдено.</p>\n\n<p>Дата на резервация: <b>'{bookingDate}'</b></p>\n\n<p>Очакваме ви с нетърпение!</p>\n\n<p>С уважение,<br>Екипът на Bookie</p>";
        }

        private Tuple<bool, List<DateTime>> GetTimeSlots(Facility facility, DateTime dateTime)
        {
            var listOfHours = new List<DateTime>();
            var currentDay = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, 0, 0, 0, DateTimeKind.Utc);
            var dayConfiguration = facility.Days.FirstOrDefault(x => x.DayDate == currentDay);

            var periodStart = (new DateTime()).ToUniversalTime();
            var periodEnd = new DateTime().ToUniversalTime();
            var interval = 0;
            var isOpen = true;

            if (dayConfiguration != null)
            {
                periodEnd = dayConfiguration.EndPeriod;
                periodStart = dayConfiguration.StartPeriod;
                interval = dayConfiguration.Interval;
                isOpen = dayConfiguration.IsOpen;
            }
            else
            {
                var globalConfig = JsonConvert.DeserializeObject<List<BusinessHoursViewModel>>(facility.WorkingDays);
                var idOfWeekDay = (int)dateTime.DayOfWeek == 0 ? 7 : (int)dateTime.DayOfWeek;
                var dayOfWeek = globalConfig.FirstOrDefault(x => x.Id == idOfWeekDay);

                periodStart = dayOfWeek?.OpeningTime != null ? dayOfWeek.OpeningTime.Value : DateTime.UtcNow;
                periodEnd = dayOfWeek?.ClosingTime != null ? dayOfWeek.ClosingTime.Value : DateTime.UtcNow.AddDays(1);
                interval = dayOfWeek.Interval!=0 ? dayOfWeek.Interval : 30;
                isOpen = dayOfWeek.IsOpen;
            }

            if (isOpen&&periodEnd>periodStart)
            {
                for (DateTime currentDateTime = periodStart; currentDateTime <= periodEnd; currentDateTime = currentDateTime.AddMinutes(interval))
                {
                    listOfHours.Add(currentDateTime);
                }
            }

            return new Tuple<bool, List<DateTime>>(isOpen,listOfHours);
        }
        private DateTime GetHourAndMinutes(DateTime dateTime)
        {
            return new DateTime(1970, 1, 1, dateTime.Hour, dateTime.Minute, 0, DateTimeKind.Utc);
        }
    }
}

