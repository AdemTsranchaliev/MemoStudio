using System;
using System.Reflection.Emit;
using Memo_Studio_Library.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Memo_Studio_Library.Data.Models
{
	public class UserFalicity
	{
		public int UserId { get; set; }

		public int FacilityId { get; set; }

        public int FacilityRoleId { get; set; }

		public User? User { get; set; }
		public Facility? Facility { get; set; }
		public FacilityRole? FacilityRole { get; set; }
    }
}

