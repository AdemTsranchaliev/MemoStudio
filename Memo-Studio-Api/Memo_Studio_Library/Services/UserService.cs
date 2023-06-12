using System;
using Memo_Studio_Library.Models;

namespace Memo_Studio_Library
{
    public class UserService : IUserService
	{
        public bool AddUser(UserViewModel model)
        {
            using (var context = new StudioContext())
            {
                User existingUser = null;

                if (model.Phone != null)
                {
                    existingUser = context.Users.FirstOrDefault(x=>x.Phone==model.Phone);
                }
                if(model.ViberId != null)
                {
                    existingUser = context.Users.FirstOrDefault(x => x.ViberId == model.ViberId);
                }

                if (existingUser!=null)
                {
                    existingUser.Name = existingUser.Name ?? model.Name;
                    existingUser.Phone = existingUser.Phone ?? model.Phone;
                    existingUser.ViberId = existingUser.ViberId ?? model.ViberId;

                    context.Users.Update(existingUser);
                    context.SaveChanges();

                    return true;
                }
                else
                {
                    var user = new User { Name = model.Name, Phone = model.Phone, ViberId = model.ViberId };
                    context.Users.Add(user);
                    context.SaveChanges();

                    return false;
                }
                
            }
        }

        public List<User> GetAllUsers()
        {
            using (var context = new StudioContext())
            {
                var users = context.Users.ToList();
                return users;
            }
        }

        public User GetUserByViberId(string viberId)
        {
            using (var context = new StudioContext())
            {
                var user = context.Users.FirstOrDefault(x => x.ViberId == viberId);
                return user ?? null;
            }
        }
    }
}

