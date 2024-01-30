using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Memo_Studio_Library.Data.Models.Configurations
{
	public class ServiceCategoryConfig : IEntityTypeConfiguration<ServiceCategory>
    {
        public void Configure(EntityTypeBuilder<ServiceCategory> builder)
        {
            builder.ToTable("ServiceCategory");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Name).IsRequired();      
            builder.Property(p => p.FacilityId).IsRequired();

            builder.Property(p => p.CreatedDate).IsRequired();
            builder.Property(p => p.DeletedDate).IsRequired(false);
            builder.Property(p => p.Deleted).HasDefaultValue(false).IsRequired();

            builder.HasOne(x => x.Facility).WithMany(x => x.ServiceCategories).HasForeignKey(x => x.FacilityId);
        }
    }
}

