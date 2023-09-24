using System;
namespace Memo_Studio_Library
{
    public class BookingViewModel
	{
        public DateTime DateTime { get; set; }

        public Guid? UserId { get; set; }

        public Guid FacilityId { get; set; }

        public int Duration { get; set; }

        public string Note { get; set; }

        public string? Name { get; set; }

        public string? Phone { get; set; }

        public string? Email { get; set; }
    }
}

