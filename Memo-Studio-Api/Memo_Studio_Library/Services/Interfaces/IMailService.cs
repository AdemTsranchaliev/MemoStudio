﻿using System;
namespace Memo_Studio_Library.Services.Interfaces
{
	public interface IMailService
	{
		public void Send(string recipientEmail, string subject, string message);
	}
}

