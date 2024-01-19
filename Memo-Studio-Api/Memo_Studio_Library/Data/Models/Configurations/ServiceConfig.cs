using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Memo_Studio_Library.Data.Models.Configurations
{
    public class ServiceConfig : IEntityTypeConfiguration<Service>
    {
        public void Configure(EntityTypeBuilder<Service> builder)
        {
            builder.ToTable("Service");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Name).IsRequired();
            builder.Property(p => p.Price).IsRequired(false);
            builder.Property(p => p.Description).IsRequired(false);
            builder.Property(p => p.Duration).IsRequired();
            builder.Property(p => p.FacilityId).IsRequired();
            builder.Property(p => p.ServiceCategoryId).IsRequired();

            builder.HasOne(x => x.Facility).WithMany(x => x.Services).HasForeignKey(x => x.FacilityId);
            builder.HasOne(x => x.ServiceCategory).WithMany(x => x.Services).HasForeignKey(x => x.ServiceCategoryId);
        }
    }
}
