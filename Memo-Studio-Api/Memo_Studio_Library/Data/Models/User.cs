using System;
using Memo_Studio_Library.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Memo_Studio_Library.Models
{
    public class User : IdentityUser<int>
    {
        public Guid UserId { get; set; }

        public string? Name { get; set; }

        public string? ViberId { get; set; }

        public List<Notification> Notifications { get; set; }
        public List<UserFalicity> UserFalicities { get; set; }
        public List<Booking> Bookings { get; set; }
    }
}
