using System;
namespace Memo_Studio_Library.Data.Models
{
	public class ServiceCategory
	{
		public ServiceCategory()
		{
			Services = new List<Service>();
		}

		public int Id { get; set; }
		public string Name { get; set; }

		public int FacilityId { get; set; }
		public Facility? Facility { get; set; }

		public List<Service> Services { get; set; }
	}
}

