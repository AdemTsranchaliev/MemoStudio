using Memo_Studio_Library.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class FacilityRoleConfig : IEntityTypeConfiguration<FacilityRole>
{
    public void Configure(EntityTypeBuilder<FacilityRole> builder)
    {
        builder.ToTable("FacilityRole");

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Name).IsRequired();
    }
}