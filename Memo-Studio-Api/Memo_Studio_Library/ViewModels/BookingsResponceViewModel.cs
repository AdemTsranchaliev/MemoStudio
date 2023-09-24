using System;
namespace Memo_Studio_Library
{
    public class BookingsResponceViewModel
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
    }
}

