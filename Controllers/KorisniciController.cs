using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SZRBot.Data;
using SZRBot.Models;

namespace SZRBot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KorisniciController : ControllerBase
    {
        private readonly KorisnikContext _context;

        public KorisniciController(KorisnikContext context)
        {
            _context = context;
        }

        // GET: api/Korisnici
        [HttpGet]
        public IEnumerable<Korisnik> GetKorisnici()
        {
            var sviKorisnici = _context.Korisnici.ToList();

            return sviKorisnici;
        }

        // GET: api/Korisnici/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetKorisnik([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var korisnik = await _context.Korisnici.FindAsync(id);

            if (korisnik == null)
            {
                return NotFound();
            }

            return Ok(korisnik);
        }

        // PUT: api/Korisnici/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKorisnik([FromRoute] int id, [FromBody] Korisnik korisnik)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != korisnik.ID)
            {
                return BadRequest();
            }

            _context.Entry(korisnik).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KorisnikExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Korisnici
        [HttpPost]
        public async Task<IActionResult> PostKorisnik([FromBody] Korisnik korisnik)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Korisnici.Add(korisnik);
            await _context.SaveChangesAsync();

            SaljiMejl mailModel = new SaljiMejl();
            MailMessage msg = new MailMessage();
            mailModel.Primalac = korisnik.Email;
            mailModel.Subject = "SZR - Stranka Zdravog Razuma";
            string text = "Poštovani,\r\n \r\n" + 
                "Čast mi je da Vam ovom prilikom uručim pozivnicu za učlanjenje u stranku, jedinu koja Vas neće lagati više od drugih, " +
                "jedinu koja Vas neće ceniti više nego drugi i isto tako jedinu koja neće biti tu za Vas kada Vam nije potrebno - Stranku Zdravog Razuma! " +
                "Raširenih ruku očekujemo da Vi, " + korisnik.Ime + " " + korisnik.Prezime + ", pristupite SZR-u " +
                "i podržite nas u borbi za bolji život nas, partijskih kolega, na sledećim parlamentarnim izborima u junu 2020. godine!\r\n \r\n" +
                "Srdačan pozdrav! Vaš jedini pravi,\r\n" +
                "Srećko Šojić";
            mailModel.Body = text;

            string emailAddress = mailModel.Primalac;

            msg.To.Add(new MailAddress(emailAddress));

            msg.From = new MailAddress("strankazdravograzuma2020@gmail.com", "Srećko Šojić");
            msg.Subject = mailModel.Subject;
            msg.Body = mailModel.Body;
            msg.IsBodyHtml = false;
            var client = new SmtpClient("smtp.gmail.com");
            client.Port = 587;
            client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            NetworkCredential cred = new NetworkCredential("strankazdravograzuma2020@gmail.com", "sreckosojic123");
            client.Credentials = cred;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls;

            try
            {
                client.Send(msg);
                msg.Dispose();

                return CreatedAtAction("GetKorisnik", new { id = korisnik.ID }, korisnik);
            }
            catch (Exception e)
            {
                return (IActionResult)e;
            }
        }

        // DELETE: api/Korisnici/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKorisnik([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var korisnik = await _context.Korisnici.FindAsync(id);
            if (korisnik == null)
            {
                return NotFound();
            }

            _context.Korisnici.Remove(korisnik);
            await _context.SaveChangesAsync();

            return Ok(korisnik);
        }

        private bool KorisnikExists(int id)
        {
            return _context.Korisnici.Any(e => e.ID == id);
        }
    }
}