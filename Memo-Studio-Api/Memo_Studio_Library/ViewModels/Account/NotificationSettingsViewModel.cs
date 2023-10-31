using System;
namespace Memo_Studio_Library.ViewModels.Account
{
	public class NotificationSettingsViewModel
	{
		public bool AllowEmailNotification { get; set; }

		public bool AllowViberNotification { get; set; }

		public string Email { get; set; }

		public bool IsViberSetUp { get; set; }
	}
}

