using System;
using System.Reflection.Emit;
using Memo_Studio_Library.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Memo_Studio_Library.Data.Models
{
	public class CalendarConfiguration : BaseModel
    {
		public DateTime StartPeriod { get; set; }

		public DateTime EndPeriod { get; set; }

		public int Interval { get; set; }

		public string WorkingDays { get; set; }

		public bool AllowUserBooking { get; set; }

        public int FacilityId { get; set; }
        public Facility Facility { get; set; }
    }
}

