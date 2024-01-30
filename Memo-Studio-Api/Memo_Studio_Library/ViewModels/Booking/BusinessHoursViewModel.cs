using System;
namespace Memo_Studio_Library.ViewModels.Booking
{
	public class BusinessHoursViewModel
	{
        public int Id { get; set; }
        public string Day { get; set; }
        public bool IsOpen { get; set; }
        public DateTime? OpeningTime { get; set; }
        public DateTime? ClosingTime { get; set; }
        public int Interval { get; set; }
    }
}

