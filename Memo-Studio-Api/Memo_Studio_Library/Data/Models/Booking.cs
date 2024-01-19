using System;
using System.Globalization;
using Memo_Studio_Library.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Memo_Studio_Library.Models
{
	public class Booking : BaseModel
    {
        public Guid BookingId { get; set; }

        public DateTime Timestamp { get; set; }

		public DateTime CreatedOn { get; set; }

        public bool Canceled { get; set; }

		public string? Note { get; set; }

		public string? Name { get; set; }

		public string? Email { get; set; }

		public string? Phone { get; set; }

        public bool Confirmed { get; set; }

        public bool RegisteredUser { get; set; }

        public int Duration { get; set; }

        public int? UserId { get; set; }
        public User? User { get; set; }

        public int FacilityId { get; set; }
        public Facility Facility { get; set; }

        public List<Notification> Notifications { get; set; }


        public string GetDateTimeInMessageFormat()
		{
            CultureInfo culture = new CultureInfo("bg-BG");
            this.Timestamp = this.Timestamp.ToLocalTime();

            string day = this.Timestamp.ToString("dd");
            string month = culture.DateTimeFormat.GetMonthName(this.Timestamp.Month);
            string year = this.Timestamp.ToString("yyyy");
            string weekday = culture.DateTimeFormat.GetDayName(this.Timestamp.DayOfWeek);
            var hour = this.Timestamp.Hour <= 10 ? $"0{this.Timestamp.Hour}" : this.Timestamp.Hour.ToString();
            var minutes = this.Timestamp.Minute <= 10 ? $"0{this.Timestamp.Minute}" : this.Timestamp.Minute.ToString();

            var date = $"*({hour}:{minutes}ч.) - {weekday}, {day} {month} {year}г.*";

			return date;
        }

        public void SetUnregisteredUser(string name, string email, string phone)
        {
            this.Email = email;
            this.Name = name;
            this.Phone = phone;
        }

    }
}

