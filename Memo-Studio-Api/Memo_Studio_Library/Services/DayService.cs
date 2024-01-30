using AutoMapper;
using Memo_Studio_Library.Data.Models;
using Memo_Studio_Library.Services.Interfaces;
using Memo_Studio_Library.ViewModels;
using Memo_Studio_Library.ViewModels.Booking;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Memo_Studio_Library.Services
{
    public class DayService : IDayService
    {
        private readonly IMessageService messageService;
        private readonly IMapper mapper;
        private readonly IFacilityService facilityService;

        public DayService(IMessageService messageService, IMapper mapper, IFacilityService facilityService)
        {
            this.messageService = messageService;
            this.mapper = mapper;
            this.facilityService = facilityService;
        }

        public async Task AddDay(DayAddViewModel model, Guid facilityId)
        {
            using (var context = new StudioContext())
            {
                var dateToSearch = new DateTime(model.DayDate.Year, model.DayDate.Month, model.DayDate.Day, 0,0, 0, 0);

                var day = await context.Days
                    .Include(x => x.Facility)
                    .FirstOrDefaultAsync(x => x.DayDate == dateToSearch && x.Facility != null && x.Facility.FacilityId == facilityId);

                if (day != null)
                {
                    day.Update(model.StartPeriod, model.EndPeriod, model.Interval);

                    context.Days.Update(day);
                }
                else
                {
                    var mappedModel = mapper.Map<Day>(model);
                    var facility = await facilityService.GetFacilityById(facilityId);

                    mappedModel.DayDate = dateToSearch;
                    mappedModel.FacilityId = facility.Id;
                    context.Days.Add(mappedModel);
                }

                await context.SaveChangesAsync();
            }
        }

        public async Task<BusinessHoursViewModel?> GetDayForFacility(DateTime dateTime, Guid facilityId)
        {
            using (var context = new StudioContext())
            {
                var facility = await facilityService.GetFacilityById(facilityId);

                var dateToSearch = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, 0, 0, 0, 0);

                var dayConfiguration = await context.Days
                    .FirstOrDefaultAsync(x => x.DayDate == dateToSearch && x.FacilityId == facility.Id);

                var result = new BusinessHoursViewModel();

                if (dayConfiguration == null)
                {
                    var globalConfig = JsonConvert.DeserializeObject<List<BusinessHoursViewModel>>(facility.WorkingDays);
                    result = globalConfig.FirstOrDefault(x => x.Id == (int)dateTime.DayOfWeek);
                }
                else
                {
                    result = new BusinessHoursViewModel
                    {
                        OpeningTime = dayConfiguration.StartPeriod,
                        ClosingTime = dayConfiguration.EndPeriod,
                        IsOpen = dayConfiguration.IsOpen,
                        Interval = dayConfiguration.Interval
                    };
                }
                   

                return result;
            }
        }

        public async Task ChangeDayStatus(DateTime date, Guid facilityId)
        {
            var dateToSearch = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0, 0);

            using (var context = new StudioContext())
            {
                var day = await context.Days
                    .Include(x => x.Facility)
                    .FirstOrDefaultAsync(x => x.DayDate == dateToSearch && x.Facility != null && x.Facility.FacilityId == facilityId);


                if (day != null)
                {
                    day.IsOpen = !day.IsOpen;

                    context.Days.Update(day);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}

