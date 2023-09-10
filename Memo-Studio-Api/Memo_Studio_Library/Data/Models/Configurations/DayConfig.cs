using Memo_Studio_Library.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class DayConfig : IEntityTypeConfiguration<Day>
{
    public void Configure(EntityTypeBuilder<Day> builder)
    {
        builder.ToTable("Day");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.DayDate).IsRequired();
        builder.Property(p => p.StartPeriod).IsRequired();
        builder.Property(p => p.EndPeriod).IsRequired();
        builder.Property(p => p.IsWorking).HasDefaultValue(true).IsRequired();

        builder.HasOne(x => x.Facility).WithMany(x => x.Days).HasForeignKey(x => x.FacilityId);
    }
}