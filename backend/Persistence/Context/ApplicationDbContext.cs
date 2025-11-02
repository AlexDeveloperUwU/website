using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Persistence.Context
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : DbContext(options)
    {
        public DbSet<Project> Projects { get; set; }
    }
}
