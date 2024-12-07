using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProEventos.API.Data;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly DataContext _context;
        public EventosController(DataContext context)
        {
            _context = context;
        }
       

        [HttpGet(Name = "GetEvento")]
        public async Task<IEnumerable<Evento>> Get()
        {
           return  await _context.Eventos.AsNoTracking().ToListAsync();
        }
        [HttpGet("{id:int}", Name = "GetEventoById")]
        public async  Task<Evento> GetById(int id)
        {
            return await _context.Eventos.AsNoTracking().FirstOrDefaultAsync(x => x.EventoId == id);
        }
    }
}
