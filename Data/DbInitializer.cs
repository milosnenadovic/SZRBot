using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SZRBot.Models;

namespace SZRBot.Data
{
    public class DbInitializer
    {
        public static void Initialize(KorisnikContext context)
        {
            context.Database.EnsureCreated();

            if (context.Korisnici.Any())
            {
                return;
            }

            //opciono: dodaćemo probne korisnike u tabelu baze pri inicijalizaciji iste
            var korisnici = new Korisnik[]
            {
                new Korisnik{ID=1,Ime="Milos",Prezime="Milosevic",Email="testni.mejl001@gmail.com"},
                new Korisnik{ID=2,Ime="Petar",Prezime="Petrovic",Email="testni.mejl002@gmail.com"},
            };
            foreach(Korisnik k in korisnici)
            {
                context.Korisnici.Add(k);
            }
            context.SaveChanges();
        }
    }
}
