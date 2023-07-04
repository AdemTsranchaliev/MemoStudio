using System;
namespace Memo_Studio_Library.Data.Models
{
    public class Day
    {
        public int Id { get; set; }

        public int EmployeeId { get; set; }

        public DateTime DayDate { get; set; }

        public DateTime StartPeriod { get; set; }

        public DateTime EndPeriod { get; set; }

        public bool IsWorking { get; set; }
    }
}

