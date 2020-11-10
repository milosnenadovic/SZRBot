using Microsoft.EntityFrameworkCore;
using SZRBot.Models;

namespace SZRBot.Data
{
    public class KorisnikContext : DbContext
    {
        public KorisnikContext(DbContextOptions<KorisnikContext> options) : base(options) { }

        public DbSet<Korisnik> Korisnici { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Korisnik>().ToTable("Korisnik");
        }
    }
}
