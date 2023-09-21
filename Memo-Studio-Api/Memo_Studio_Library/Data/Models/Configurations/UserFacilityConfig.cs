using Memo_Studio_Library.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class UserFalicityConfig : IEntityTypeConfiguration<UserFalicity>
{
    public void Configure(EntityTypeBuilder<UserFalicity> builder)
    {
        builder.ToTable("UserFalicity");

        builder
            .HasKey(x => new { x.UserId, x.FacilityId });


        builder
            .HasOne(sc => sc.User)
            .WithMany(s => s.UserFalicities)
            .HasForeignKey(sc => sc.UserId);

        builder
            .HasOne(sc => sc.Facility)
            .WithMany(c => c.UserFalicities)
            .HasForeignKey(sc => sc.FacilityId);
    }
}