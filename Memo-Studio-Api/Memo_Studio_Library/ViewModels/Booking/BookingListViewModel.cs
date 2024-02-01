namespace Memo_Studio_Library.ViewModels.Booking
{
	public class BookingListViewModel
	{
		public BookingListViewModel()
		{
			Bookings = new List<BookingsResponceViewModel>();
		}

		public bool IsOpen { get; set; }
		public List<BookingsResponceViewModel> Bookings { get; set; }
    }
}

