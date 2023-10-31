using System;
namespace Memo_Studio_Library.ViewModels.FacilityViewModels
{
	public class FacilitySettingsViewModel
	{
		public string StartPeriod { get; set; }
		public string EndPeriod { get; set; }
		public int Interval { get; set; }
		public string WorkingDaysJson { get; set; }
		public bool AllowUserBooking { get; set; }
	}
}

