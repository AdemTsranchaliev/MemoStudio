using System;
using Memo_Studio_Library.Models;
using Memo_Studio_Library.ViewModels.Booking;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;

namespace Memo_Studio_Library.Data.Models
{
	public class Facility : BaseModel
	{
		public Facility()
		{
			StartPeriod = new DateTime(1900, 1, 1, 8, 0, 0);
			EndPeriod = new DateTime(1900, 1, 1, 17, 0, 0);
			Interval = 30;
			Notifications = new List<Notification>();
			UserFalicities = new List<UserFalicity>();
			Bookings = new List<Booking>();
			Days = new List<Day>();
			Services = new List<Service>();
			ServiceCategories = new List<ServiceCategory>();

        }
		
		public Guid FacilityId { get; set; }

		public string Name { get; set; }

		public string Description { get; set; }

        public DateTime StartPeriod { get; set; }

        public DateTime EndPeriod { get; set; }

        public int Interval { get; set; }

        public string WorkingDays { get; set; }

        public bool AllowUserBooking { get; set; }

        public List<Notification> Notifications { get; set; }

		public List<UserFalicity> UserFalicities { get; set; }

		public List<Booking> Bookings { get; set; }

		public List<Day> Days { get; set; }

		public List<Service> Services { get; set; }

		public List<ServiceCategory> ServiceCategories { get; set; }

		public List<BusinessHoursViewModel> GetBussinesHours()
		{
			return JsonConvert.DeserializeObject<List<BusinessHoursViewModel>>(this.WorkingDays);
		}
    }
}

