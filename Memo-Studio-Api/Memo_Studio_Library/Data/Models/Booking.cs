using System;
namespace Memo_Studio_Library.Models
{
	public class Booking
	{
		public Booking()
		{
		}

		public int Id { get; set; }

		public DateTime Timestamp { get; set; }

		public DateTime CreatedOn { get; set; }

		public User User { get; set; }

		public int UserId{ get; set; }

        public bool Canceled { get; set; }

		public int EmployeeId { get; set; }

		public string ReservationId { get; set; }
		public string Note { get; set; }
    }
}

