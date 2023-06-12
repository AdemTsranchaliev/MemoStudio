using System;
using Memo_Studio_Library.Models;

namespace Memo_Studio_Library
{
    public interface IUserService
	{
		public bool AddUser(UserViewModel model);
		public User GetUserByViberId(string viberId);
		public List<User> GetAllUsers();
	}
}

