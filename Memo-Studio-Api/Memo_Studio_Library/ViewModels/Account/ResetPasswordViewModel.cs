﻿using System;
namespace Memo_Studio_Library.ViewModels.Account
{
	public class ResetPasswordViewModel
	{
		public string Email { get; set; }
		public string Token { get; set; }
		public string NewPassword { get; set; }
	}
}

