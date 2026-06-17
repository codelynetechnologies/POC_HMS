using HMS.PatientRegistration.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HMS.PatientRegistration.Infrastructure.Persistence;

/// <summary>
/// EF Core context for the patient registration module. Address, professional and
/// additional details are modelled as owned types within the Patient aggregate.
/// </summary>
public class PatientRegistrationDbContext : DbContext
{
    public PatientRegistrationDbContext(DbContextOptions<PatientRegistrationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<DropdownItem> DropdownItems => Set<DropdownItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.ToTable("Patients");
            entity.HasKey(p => p.Id);
            entity.Property(p => p.MrNumber).HasMaxLength(50);
            entity.HasIndex(p => p.MrNumber);
            entity.Property(p => p.FirstName).HasMaxLength(100).IsRequired();
            entity.Property(p => p.MiddleName).HasMaxLength(100);
            entity.Property(p => p.LastName).HasMaxLength(100).IsRequired();
            entity.Property(p => p.MobileNumber).HasMaxLength(20).IsRequired();
            entity.Property(p => p.Email).HasMaxLength(150);
            entity.Property(p => p.CivilId).HasMaxLength(50);
            entity.Property(p => p.AppointmentReference).HasMaxLength(100);
            entity.Property(p => p.PatientType).HasConversion<int>();
            entity.Property(p => p.Gender).HasConversion<int>();

            entity.OwnsOne(p => p.Address);
            entity.OwnsOne(p => p.ProfessionalDetails);
            entity.OwnsOne(p => p.AdditionalDetails);
        });

        modelBuilder.Entity<DropdownItem>(entity =>
        {
            entity.ToTable("DropdownItems");
            entity.HasKey(d => d.Id);
            entity.Property(d => d.Type).HasMaxLength(50).IsRequired();
            entity.Property(d => d.Code).HasMaxLength(50).IsRequired();
            entity.Property(d => d.Name).HasMaxLength(150).IsRequired();
            entity.Property(d => d.ParentCode).HasMaxLength(50);
            entity.HasIndex(d => new { d.Type, d.ParentCode });
        });
    }
}
