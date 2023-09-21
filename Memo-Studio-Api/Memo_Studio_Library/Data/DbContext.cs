using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;
using Memo_Studio_Library.Data.Models;
using Memo_Studio_Library.Models;
using Microsoft.EntityFrameworkCore;

public class StudioContext : DbContext
{
    public StudioContext(DbContextOptions<StudioContext> options)
            : base(options)
    {
    }
    public StudioContext()
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new BookingConfig());
        modelBuilder.ApplyConfiguration(new DayConfig());
        modelBuilder.ApplyConfiguration(new FacilityConfig());
        modelBuilder.ApplyConfiguration(new FacilityRoleConfig());
        modelBuilder.ApplyConfiguration(new NotificationConfig());
        modelBuilder.ApplyConfiguration(new UserConfig());
        modelBuilder.ApplyConfiguration(new UserFalicityConfig());

    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            OperatingSystem os = System.Environment.OSVersion;

            if (os.Platform == PlatformID.Win32NT)
            {
                optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=MemoStudio;TrustServerCertificate=True;Trusted_Connection=True");
            }
            // Check if the operating system is macOS
            else if (os.Platform == PlatformID.Unix)
            {
                optionsBuilder.UseSqlServer("Server=tcp:127.0.0.1,1433;Database=MemoStudio;MultipleActiveResultSets=true;User=sa;Password=MyPass@word;TrustServerCertificate=True;MultiSubnetFailover=True");

            }
        }
    }

    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Day> Days { get; set; }
    public DbSet<Facility> Facilities { get; set; }
    public DbSet<FacilityRole> FacilityRoles { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserFalicity> UserFalicities { get; set; }
}