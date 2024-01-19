
using Memo_Studio_Library.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class BookingConfig : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.ToTable("Booking");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.BookingId).IsRequired();
        builder.Property(p => p.Timestamp).IsRequired();
        builder.Property(p => p.CreatedOn).IsRequired();
        builder.Property(p => p.Canceled).IsRequired();
        builder.Property(p => p.Duration).IsRequired();
        builder.Property(p => p.Note).IsRequired(false);
        builder.Property(p => p.Name).IsRequired(false);
        builder.Property(p => p.Email).IsRequired(false);
        builder.Property(p => p.Phone).IsRequired(false);
        builder.Property(p => p.Confirmed).IsRequired();
        builder.Property(p => p.RegisteredUser).IsRequired();
        builder.Property(p => p.UserId).IsRequired(false);
        builder.Property(p => p.FacilityId).IsRequired();
        builder.Property(p => p.ServiceId).IsRequired(false);

        builder.HasOne(x => x.User).WithMany(x => x.Bookings).HasForeignKey(x => x.UserId);
        builder.HasOne(x => x.Facility).WithMany(x => x.Bookings).HasForeignKey(x => x.FacilityId);
    }
}