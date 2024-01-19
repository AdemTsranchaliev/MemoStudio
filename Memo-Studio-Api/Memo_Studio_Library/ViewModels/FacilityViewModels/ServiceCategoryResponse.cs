using System;
namespace Memo_Studio_Library.ViewModels.FacilityViewModels
{
	public class ServiceCategoryResponse
	{
        public ServiceCategoryResponse()
        {
            Services = new List<ServiceResponse>();
        }
        public int Id { get; set; }
        public string Name { get; set; }

        public int FacilityId { get; set; }
        public List<ServiceResponse> Services { get; set; }
    }
}

