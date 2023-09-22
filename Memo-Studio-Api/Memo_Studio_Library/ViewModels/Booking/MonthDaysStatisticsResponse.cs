namespace Memo_Studio_Library.ViewModels.Booking
{
	public class MonthDaysStatisticsResponse
	{
		public MonthDaysStatisticsResponse(int day, int status)
		{
			this.Day = day;
			this.Status = status;
		}

		public int Day { get; set; }
		public int Status { get; set; }
    }
}

