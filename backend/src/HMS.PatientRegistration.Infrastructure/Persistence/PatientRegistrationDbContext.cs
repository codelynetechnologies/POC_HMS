using HMS.PatientRegistration.Application.Interfaces;
using HMS.PatientRegistration.Domain.Common;
using HMS.PatientRegistration.Domain.Entities;
using HMS.PatientRegistration.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HMS.PatientRegistration.Infrastructure.Persistence;

public class PatientRegistrationDbContext : DbContext
{
    private readonly ICurrentUserService? _currentUser;

    public PatientRegistrationDbContext(
        DbContextOptions<PatientRegistrationDbContext> options,
        ICurrentUserService? currentUser = null)
        : base(options)
    {
        _currentUser = currentUser;
    }

    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<DropdownItem> DropdownItems => Set<DropdownItem>();

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyAuditFields();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        ApplyAuditFields();
        return base.SaveChanges();
    }

    private void ApplyAuditFields()
    {
        var user = _currentUser?.UserName ?? "system";
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<IAuditableEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedOn = now;
                entry.Entity.CreatedBy ??= user;
                entry.Entity.IsActive = true;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.ModifiedOn = now;
                entry.Entity.ModifiedBy = user;
            }
        }
    }

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
            entity.Property(p => p.CreatedBy).HasMaxLength(100);
            entity.Property(p => p.ModifiedBy).HasMaxLength(100);
            entity.Property(p => p.PatientType).HasConversion<int>();
            entity.Property(p => p.Gender).HasConversion<int>();
            entity.HasQueryFilter(p => p.IsActive);

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
            entity.HasQueryFilter(d => d.IsActive);
        });
    }
}
