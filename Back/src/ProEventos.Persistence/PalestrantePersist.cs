using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
    public class PalestrantePersist : IPalestrantePersist
    {
        private readonly ProEventosContext _context;

        public PalestrantePersist(ProEventosContext context)
        {
            _context = context;
        }

        public async Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(p => p.RedesSociais);
            if (includeEventos)
            {
                query = query.Include(e => e.PalestrantesEventos)
                    .ThenInclude(e => e.Evento);
            }
            query = query.AsNoTracking().OrderBy(p => p.Id);
            return await query.ToArrayAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes.
                 Include(p => p.RedesSociais);
            if (includeEventos)
            {
                query = query.Include(p => p.PalestrantesEventos)
                    .ThenInclude(e => e.Evento);
            }
            query = query.AsNoTracking().OrderBy(p => p.Id);
            //p => p.User.NomeCompleto.ToLower().Contains(nome.ToLower())
            return await query.Where(p => p.User.PrimeiroNome.ToLower().Contains(nome.ToLower())).ToArrayAsync();
        }
        public async Task<Palestrante> GetPalestranteAsync(int palestranteId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes.Include(p => p.RedesSociais);
            if (includeEventos)
            {
                query = query.Include(p => p.PalestrantesEventos)
     .ThenInclude(e => e.Evento);
            }
            return await query.AsNoTracking().FirstOrDefaultAsync(p => p.Id == palestranteId);
        }

    }
}
