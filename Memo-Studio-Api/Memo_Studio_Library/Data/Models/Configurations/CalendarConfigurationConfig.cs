
using Memo_Studio_Library.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class CalendarConfigurationConfig : IEntityTypeConfiguration<CalendarConfiguration>
{
    public void Configure(EntityTypeBuilder<CalendarConfiguration> builder)
    {
        builder.ToTable("CalendarConfiguration");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.StartPeriod).IsRequired();
        builder.Property(p => p.EndPeriod).IsRequired();
        builder.Property(p => p.WorkingDays).IsRequired(false);
        builder.Property(p => p.AllowUserBooking).HasDefaultValue(false).IsRequired();

        builder
               .HasOne(cc => cc.Facility)             // CalendarConfiguration has one Facility
               .WithOne(f => f.CalendarConfiguration) // Facility has one CalendarConfiguration
               .HasForeignKey<Facility>(f => f.CalendarConfigurationId);
    }
}