using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Mecca.API.Models;

namespace Mecca.API.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("AuditLogs");

            entity.Property(x => x.EventType).HasMaxLength(64).IsRequired();
            entity.Property(x => x.UserId).HasMaxLength(450);
            entity.Property(x => x.Email).HasMaxLength(256);
            entity.Property(x => x.IpAddress).HasMaxLength(45);
            entity.Property(x => x.UserAgent).HasMaxLength(512);
            entity.Property(x => x.Path).HasMaxLength(256);
            entity.Property(x => x.Reason).HasMaxLength(256);

            entity.HasIndex(x => x.OccurredAtUtc);
            entity.HasIndex(x => new { x.EventType, x.OccurredAtUtc });
            entity.HasIndex(x => new { x.UserId, x.OccurredAtUtc });
        });
    }
}
