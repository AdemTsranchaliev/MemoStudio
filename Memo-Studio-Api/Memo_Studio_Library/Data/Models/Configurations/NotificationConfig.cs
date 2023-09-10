
using Memo_Studio_Library.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class NotificationConfig : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("Notification");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.SentOn).IsRequired();
        builder.Property(p => p.Type).IsRequired();
        builder.Property(p => p.Message).IsRequired();
        builder.Property(p => p.BookingId).IsRequired();
        builder.Property(p => p.UserId).IsRequired();
        builder.Property(p => p.FacilityId).IsRequired();

        builder.HasOne(x => x.User).WithMany(x => x.Notifications).HasForeignKey(x => x.UserId);
        builder.HasOne(x => x.Facility).WithMany(x => x.Notifications).HasForeignKey(x => x.FacilityId);
        builder.HasOne(x => x.Booking).WithMany(x => x.Notifications).HasForeignKey(x => x.BookingId);

    }
}