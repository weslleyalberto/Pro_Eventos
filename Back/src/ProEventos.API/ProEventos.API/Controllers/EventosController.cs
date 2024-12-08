using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence;


namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly ProEventosContext _context;
        public EventosController(ProEventosContext context)
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
            return await _context.Eventos.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}
