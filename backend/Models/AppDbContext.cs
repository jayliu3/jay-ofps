using Microsoft.EntityFrameworkCore;

namespace Ofps.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<FileInfo> FileInfos { get; set; }
        public DbSet<Videos> Videos { get; set; }
    }
}
