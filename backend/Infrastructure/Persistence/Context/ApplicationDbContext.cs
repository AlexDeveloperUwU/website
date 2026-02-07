using Microsoft.EntityFrameworkCore;
using Portfolio.Backend.Application.Models.Entities;

namespace Portfolio.Backend.Infrastructure.Persistence.Context
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : DbContext(options)
    {
        public DbSet<Project> Projects { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Project>().HasIndex(p => p.Name);
            modelBuilder.Entity<Project>().HasIndex(p => p.Org);
            modelBuilder.Entity<Project>().HasIndex(p => p.Show);
            modelBuilder.Entity<Project>().HasIndex(p => p.ShowOnHomepage);
            modelBuilder.Entity<Project>().HasIndex(p => p.Tech).HasMethod("gin");
        }
    }
}
