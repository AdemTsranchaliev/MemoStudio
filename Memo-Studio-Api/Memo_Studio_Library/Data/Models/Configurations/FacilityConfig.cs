
using Memo_Studio_Library.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class FacilityConfig : IEntityTypeConfiguration<Facility>
{
    public void Configure(EntityTypeBuilder<Facility> builder)
    {
        builder.ToTable("Facility");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name).IsRequired(false).HasMaxLength(100);
        builder.Property(p => p.FacilityId).IsRequired();
        builder.Property(p => p.Description).IsRequired(false);

        builder.HasOne(x => x.CalendarConfiguration).WithOne(x => x.Facility).HasForeignKey<CalendarConfiguration>(x => x.Id);
    }
}