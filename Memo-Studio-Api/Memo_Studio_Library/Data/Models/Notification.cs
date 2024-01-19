using System;
using Memo_Studio_Library.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Memo_Studio_Library.Data.Models
{
	public class Notification : BaseModel
    {
		public DateTime SentOn { get; set; }

        public int Type { get; set; }

        public string Message { get; set; }

        public int BookingId { get; set; }

		public int UserId { get; set; }

		public int FacilityId { get; set; }

		public Booking? Booking { get; set; }

		public Facility? Facility { get; set; }

		public User? User { get; set; }
    }
}

