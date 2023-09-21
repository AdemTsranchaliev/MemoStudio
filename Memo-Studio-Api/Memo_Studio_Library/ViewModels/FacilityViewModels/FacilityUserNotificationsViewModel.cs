using System;
namespace Memo_Studio_Library.ViewModels.FacilityViewModels
{
	public class FacilityUserNotificationsViewModel
	{
        public DateTime SentOn { get; set; }

        public int Type { get; set; }

        public string Message { get; set; }

        public int Status { get; set; }
    }
}

