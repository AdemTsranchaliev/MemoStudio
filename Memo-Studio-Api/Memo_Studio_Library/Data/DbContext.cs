using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;
using Memo_Studio_Library.Models;
using Microsoft.EntityFrameworkCore;

public class StudioContext : DbContext
{
    public StudioContext()
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .ToTable("Users");
        modelBuilder.Entity<User>()
            .Property(b => b.Id)
            .IsRequired();
        modelBuilder.Entity<User>()
            .Property(b => b.Name)
            .IsRequired(false);
        modelBuilder.Entity<User>()
            .Property(b => b.Id)
            .IsRequired();
        modelBuilder.Entity<User>()
            .Property(b => b.ViberId)
            .IsRequired(false);

        modelBuilder.Entity<Booking>()
            .ToTable("Bookings");
        modelBuilder.Entity<Booking>()
            .Property(b => b.Id)
            .IsRequired();

    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {

        optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=MemoStudio;TrustServerCertificate=True;Trusted_Connection=True");
        //optionsBuilder.UseSqlServer("Server=tcp:127.0.0.1,1433;Database=MemoStudio;MultipleActiveResultSets=true;User=sa;Password=MyPass@word;TrustServerCertificate=True;MultiSubnetFailover=True");
    }

    public DbSet<Booking> Bookings { get; set; }
    public DbSet<User> Users { get; set; }
}