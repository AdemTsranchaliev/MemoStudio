using System;
using Memo_Studio_Library.Models;

namespace Memo_Studio_Library.Data.Models
{
	public class ViberCode : BaseModel
	{
		public DateTime ValidTo { get; set; }
		public DateTime GeneratedOn { get; set; }
		public string Code { get; set; }
		public bool IsUsed { get; set; }

		public int UserId { get; set; }
		public User User { get; set; }
	}
}

