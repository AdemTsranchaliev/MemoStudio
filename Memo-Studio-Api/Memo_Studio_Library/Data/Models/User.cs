using System;
using Microsoft.AspNetCore.Identity;

namespace Memo_Studio_Library.Models
{
    public class User : IdentityUser
    {
        public User()
        {
        }

        public int Id { get; set; }

        public string? Name { get; set; }

        public string? ViberId { get; set; }

        public bool EmailConfirmed { get; set; }
    }
}
