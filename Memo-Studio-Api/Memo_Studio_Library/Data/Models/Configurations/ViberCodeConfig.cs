using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Memo_Studio_Library.Data.Models.Configurations
{
    public class ViberCodeConfig : IEntityTypeConfiguration<ViberCode>
    {
        public void Configure(EntityTypeBuilder<ViberCode> builder)
        {
            builder.ToTable("ViberCode");

            builder.HasKey(x => x.Id);


            builder
                .HasOne(x => x.User)
                .WithMany(s => s.ViberCodes)
                .HasForeignKey(sc => sc.UserId);
        }
    }
}
