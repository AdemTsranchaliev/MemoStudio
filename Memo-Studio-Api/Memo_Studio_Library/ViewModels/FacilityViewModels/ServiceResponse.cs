using System;
using Memo_Studio_Library.Data.Models;

namespace Memo_Studio_Library.ViewModels.FacilityViewModels
{
	public class ServiceResponse
	{
        public int Id { get; set; }

        public string Name { get; set; }

        public double? Price { get; set; }

        public string? Description { get; set; }

        public int Duration { get; set; }

        public int FacilityId { get; set; }

        public int ServiceCategoryId { get; set; }
    }
}

