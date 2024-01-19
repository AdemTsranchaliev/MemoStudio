using System;
using Memo_Studio_Library.Models;

namespace Memo_Studio_Library.Data.Models
{
	public class Service
	{
		public Service()
		{
		}

		public int Id { get; set; }

		public string Name { get; set; }

		public double? Price { get; set; }

		public string? Description { get; set; }

		public int Duration { get; set; }

		public List<Booking> Bookings { get; set; }

		public int FacilityId { get; set; }
        public Facility? Facility { get; set; }

        public ServiceCategory? ServiceCategory { get; set; }
        public int ServiceCategoryId { get; set; }
	}
}

