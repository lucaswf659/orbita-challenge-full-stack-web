using EdTech.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace EdTech.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Student> Students => Set<Student>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Student>()
            .HasIndex(s => s.RA)
            .IsUnique();

        modelBuilder.Entity<Student>()
            .HasIndex(s => s.CPF)
            .IsUnique();
    }
}
