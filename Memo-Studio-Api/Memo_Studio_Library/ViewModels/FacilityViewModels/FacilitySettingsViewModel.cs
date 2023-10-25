using System;
namespace Memo_Studio_Library.ViewModels.FacilityViewModels
{
	public class FacilitySettingsViewModel
	{
		public DateTime StartPeriod { get; set; }
		public DateTime EndPeriod { get; set; }
		public int Interval { get; set; }
		public string WorkingDaysJson { get; set; }
		public bool AllowUserBooking { get; set; }
	}
}

