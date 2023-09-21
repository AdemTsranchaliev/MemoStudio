using System;
using Memo_Studio_Library.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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
                    existingUser = context.Users.FirstOrDefault(x=>x.PhoneNumber == model.Phone);
                }
                if(model.ViberId != null)
                {
                    existingUser = context.Users.FirstOrDefault(x => x.ViberId == model.ViberId);
                }

                if (existingUser!=null)
                {
                    existingUser.Name = existingUser.Name ?? model.Name;
                    existingUser.PhoneNumber = existingUser.PhoneNumber ?? model.Phone;
                    existingUser.ViberId = existingUser.ViberId ?? model.ViberId;

                    context.Users.Update(existingUser);
                    context.SaveChanges();

                    return true;
                }
                else
                {
                    var user = new User { Name = model.Name, PhoneNumber = model.Phone, ViberId = model.ViberId };
                    context.Users.Add(user);
                    context.SaveChanges();

                    return false;
                }
                
            }
        }

        public async Task<List<User>> GetAllUsers()
        {
            using (var context = new StudioContext())
            {
                var users = await context.Users.ToListAsync();
                return users;
            }
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            using (var context = new StudioContext())
            {
                var user = await context.Users
                    .Include(x=>x.UserFalicities)
                    .ThenInclude(x=>x.Facility)
                    .FirstOrDefaultAsync(x=>x.Email==email);

                return user;
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

