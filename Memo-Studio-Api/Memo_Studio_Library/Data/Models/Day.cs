namespace Memo_Studio_Library.Data.Models
{
    public class Day : BaseModel
    {
        public DateTime DayDate { get; set; }

        public DateTime StartPeriod { get; set; }

        public DateTime EndPeriod { get; set; }

        public int Interval { get; set; }

        public bool IsOpen { get; set; }

        public int FacilityId { get; set; }
        public Facility Facility { get; set; }


        public void Update(DateTime dayDate, DateTime startPeriod, DateTime endPeriod, int interval, bool isOpen)
        {
            this.DayDate = DayDate;
            this.StartPeriod = startPeriod;
            this.EndPeriod = endPeriod;
            this.Interval = interval;
            this.IsOpen = isOpen;
        }

        public void CancelDay()
        {

        }
    }
}

