using System;
namespace Memo_Studio_Library.ViewModels.FacilityViewModels
{
	public class BookingUsersAutocompleteViewModel
	{
		public string? Name { get; set; }

		public string? Phone { get; set; }

		public string? Email { get; set; }

		public bool RegisteredUser { get; set; } = false;

		public string? UserId { get; set; }
	}
}

