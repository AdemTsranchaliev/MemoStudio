using System;
namespace Memo_Studio_Library.ViewModels.FacilityViewModels
{
	public class FacilityServicesForUserViewModel
	{
		public string ImageBase64 { get; set; }
		public string Name { get; set; }
		public List<ServiceCategoryResponse> Services { get; set; }
	}
}

