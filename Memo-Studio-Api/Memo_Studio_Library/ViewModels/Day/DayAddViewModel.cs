using System;
namespace Memo_Studio_Library.ViewModels
{
	public class DayAddViewModel
	{
        public int Id { get; set; }

        public DateTime DayDate { get; set; }

        public DateTime StartPeriod { get; set; }

        public DateTime EndPeriod { get; set; }

        public int Interval { get; set; }

        public bool IsOpen { get; set; }
    }
}

