using System;
using Memo_Studio_Library.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Memo_Studio_Library.Data.Models
{
	public class FacilityRole : BaseModel
	{
		public string Name { get; set; }

		public List<UserFalicity> UserFalicities { get; set; }
	}
}

