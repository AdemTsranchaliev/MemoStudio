using Memo_Studio_Library.Data.Models;
using Microsoft.AspNetCore.Identity;

namespace Memo_Studio_Library.Models
{
    public class User : IdentityUser<int>
    {
        public Guid UserId { get; set; }

        public string? Name { get; set; }

        public string? ViberId { get; set; }

        public string? ImageBase64Code { get; set; }

        public bool AllowEmailNotification { get; set; }

        public bool AllowViberNotification { get; set; }

        public List<Notification> Notifications { get; set; }
        public List<UserFalicity> UserFalicities { get; set; }
        public List<Booking> Bookings { get; set; }
        public List<ViberCode> ViberCodes { get; set; }
    }
}
