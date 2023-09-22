using System;
namespace Memo_Studio_Library.ViewModels.Booking
{
	public class BusinessHoursViewModel
	{
        public int Id { get; set; }
        public string Day { get; set; }
        public bool IsOpen { get; set; }
        public string OpeningTime { get; set; }
        public string ClosingTime { get; set; }
    }
}

