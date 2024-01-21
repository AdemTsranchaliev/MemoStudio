namespace Memo_Studio_Library.ViewModels.FacilityViewModels
{
    public class ServiceViewModel
	{
		public int? Id { get; set; }
		public string Name { get; set; }
		public string? Description { get; set; }
        public double? Price { get; set; }
        public int Duration { get; set; }
        public int ServiceCategoryId { get; set; }
    }
}

