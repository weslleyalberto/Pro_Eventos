using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
    public class EventoPersist : IEventoPersist
    {
        private readonly ProEventosContext _context;

        public EventoPersist(ProEventosContext context)
        {
            _context = context;
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        public async Task<Evento[]> GetAllEventosAsync(int userId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(e => e.Lotes)
                .Include(e => e.RedesSociais);
            if (includePalestrantes)
            {
                query = query.Include(e => e.PalestrantesEventos)
                    .ThenInclude(p => p.Palestrante);

            }
            query = query.Where(u => u.UserId == userId).OrderBy(e => e.Id);
            return await query.ToArrayAsync();

        }

        public async Task<Evento[]> GetAllEventosByTemaAsync(int userId, string tema, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(e => e.Lotes)
                .Include(e => e.RedesSociais);
            if (includePalestrantes)
            {
                query = query.Include(e => e.PalestrantesEventos)
                .ThenInclude(p => p.Palestrante);
            }
            query = query
                .Where(e => e.UserId == userId && e.Tema.ToLower().Contains(tema.ToLower())).OrderBy(e => e.Id);
               
            return await query.ToArrayAsync();
        }



        public async Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(e => e.Lotes)
                .Include(e => e.RedesSociais);
            if (includePalestrantes)
            {
                query = query.Include(pe => pe.PalestrantesEventos).ThenInclude(p => p.Palestrante);
            }
            query = query.AsNoTracking().OrderBy(e=> e.Id).Where(e=> e.UserId == userId && e.Id == eventoId);
            return await query.FirstOrDefaultAsync();
        }
    }
}
