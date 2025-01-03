using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
    public class LotePersist : ILotePersist
    {
        private readonly ProEventosContext _context;

        public LotePersist(ProEventosContext context)
        {
            _context = context;
        }

        public async Task<Lote> GetLoteByIdsAsync(int eventoId, int id)
        {
            IQueryable<Lote> query = _context.
                Lotes.AsNoTracking()
                .Where(c => c.Id == id && c.EventoId == eventoId);
           
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Lote[]> GetLotesByEventoIdAsync(int eventoId)
        {
            IQueryable<Lote> query = _context.
                Lotes.AsNoTracking();
                
            query = query.OrderBy(c => c.Id).Where(c => c.EventoId == eventoId);
            return await query.ToArrayAsync();
        }
    }
}
