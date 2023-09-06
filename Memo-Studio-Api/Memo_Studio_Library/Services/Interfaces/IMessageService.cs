using System;

namespace Memo_Studio_Library
{
    public interface IMessageService
	{
        public Task SendMessage(string viberId, string message);
    }
}

