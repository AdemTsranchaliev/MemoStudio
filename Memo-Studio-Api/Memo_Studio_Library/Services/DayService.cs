using System;
using System.Globalization;
using AutoMapper;
using Memo_Studio_Library.Data.Models;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.Services.Interfaces;
using Memo_Studio_Library.ViewModels;
using Microsoft.EntityFrameworkCore;

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
                var day = await context.Days.FirstOrDefaultAsync(x => x.Id == model.Id);

                if (day != null)
                {
                    day.Update(model.DayDate, model.StartPeriod, model.EndPeriod, model.Interval, model.IsOpen);

                    context.Days.Update(day);
                }
                else
                {
                    var mappedModel = mapper.Map<Day>(model);
                    var facility = await facilityService.GetFacilityById(facilityId);

                    mappedModel.FacilityId = facility.Id;
                    context.Days.Add(mappedModel);
                }

                await context.SaveChangesAsync();
            }
        }

        public async Task<Day> GetDayForFacility(DateTime dateTime, Guid facilityId)
        {
            using (var context = new StudioContext())
            {
                return await context.Days
                    .Include(x=>x.Facility)
                    .FirstOrDefaultAsync(x => x.DayDate.Year == dateTime.Year &&
                x.DayDate.Month == dateTime.Month &&
                x.DayDate.Day == dateTime.Day
                && x.Facility.FacilityId == facilityId);
            }
        }

        public async Task CancelDay(int dayId, Guid facilityId)
        {
            using (var context = new StudioContext())
            {
                var day = await context.Days
                    .Include(x=>x.Facility)
                    .FirstOrDefaultAsync(x => x.Id == dayId && x.Facility.FacilityId == facilityId);

                if (day != null)
                {
                    //day.Update(model.DayDate, model.StartPeriod, model.EndPeriod, model.Interval, model.IsOpen);

                    context.Days.Update(day);
                }
            }
        }
    }
}

