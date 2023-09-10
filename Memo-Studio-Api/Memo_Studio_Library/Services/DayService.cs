using System;
using System.Globalization;
using Memo_Studio_Library.Data.Models;
using Memo_Studio_Library.Models;
using Microsoft.EntityFrameworkCore;

namespace Memo_Studio_Library.Services
{
    public class DayService : IDayService
    {
        private readonly IMessageService messageService;

        public DayService(IMessageService messageService)
        {
            this.messageService = messageService;
        }

        public void AddDay(Day model)
        {
            using (var context = new StudioContext())
            {
                model.DayDate = model.DayDate.ToLocalTime();
                model.DayDate = new DateTime(model.DayDate.Year, model.DayDate.Month, model.DayDate.Day);
                var foundModel = context.Days.FirstOrDefault(x=>x.DayDate==model.DayDate);
                model.StartPeriod = model.StartPeriod.ToLocalTime();
                model.EndPeriod = model.EndPeriod.ToLocalTime();
                if (foundModel != null)
                {
                    foundModel.IsWorking = model.IsWorking;
                    foundModel.StartPeriod = model.StartPeriod;
                    foundModel.EndPeriod = model.EndPeriod;
                    foundModel.DayDate = model.DayDate;

                    context.Days.Update(foundModel);
                }
                else
                {
                    context.Days.Add(model);
                }

                context.SaveChanges();
            }
        }

        public Day GetDay(DateTime dateTime, int employeeId)
        {
            using (var context = new StudioContext())
            {
                return context.Days.FirstOrDefault(x => x.DayDate.Year == dateTime.Year&&
                x.DayDate.Month == dateTime.Month &&
                x.DayDate.Day == dateTime.Day);
            }
        }

        public async Task CancelDay(Day day)
        {
            using (var context = new StudioContext())
            {
                var foundModel = context.Days.FirstOrDefault(x => x.DayDate == day.DayDate);

                if (foundModel != null)
                {
                    foundModel.IsWorking = false;
                    context.Days.Update(foundModel);
                }
                else
                {
                    context.Days.Add(day);
                }

                var bookings = await context.Bookings.Include(x => x.User).Where(x => x.Timestamp.Year == day.DayDate.Year && x.Timestamp.Month == day.DayDate.Month && x.Timestamp.Day == day.DayDate.Day&!x.Canceled).ToListAsync();
                CultureInfo culture = new CultureInfo("bg-BG");

                string dayD = day.DayDate.ToString("dd");
                string month = culture.DateTimeFormat.GetMonthName(day.DayDate.Month);
                string year = day.DayDate.ToString("yyyy");
                string weekday = culture.DateTimeFormat.GetDayName(day.DayDate.DayOfWeek);
                foreach (var booking in bookings)
                {
                    await messageService.SendMessage(booking.User.ViberId, $"Вашият час за \n*{weekday}, {dayD} {month} {year}г.* беше отменен. Извинете ни за неудобството!");

                    booking.Canceled = true;
                    context.Bookings.Update(booking);
                }
                
                context.SaveChanges();
            }
        }
    }
}

