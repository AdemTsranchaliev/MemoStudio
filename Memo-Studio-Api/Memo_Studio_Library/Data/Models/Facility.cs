using System;
using Memo_Studio_Library.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Memo_Studio_Library.Data.Models
{
	public class Facility : BaseModel
	{
		public Guid FacilityId { get; set; }

		public string Name { get; set; }

		public string Description { get; set; }

        public int CalendarConfigurationId { get; set; }
        public CalendarConfiguration CalendarConfiguration { get; set; }

        public List<Notification> Notifications { get; set; }

		public List<UserFalicity> UserFalicities { get; set; }

		public List<Booking> Bookings { get; set; }

		public List<Day> Days { get; set; }
    }
}

