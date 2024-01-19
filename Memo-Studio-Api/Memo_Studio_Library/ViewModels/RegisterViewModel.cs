using System;
namespace Memo_Studio_Library.ViewModels
{
	public class RegisterViewModel
	{
		public string Name { get; set; }
		public string Email { get; set; }
		public string? Phone { get; set; }
		public string Password { get; set; }
		public bool IsBussines { get; set; }
	}
}

