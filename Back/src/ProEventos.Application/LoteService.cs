using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class LoteService : ILoteService
    {
        private readonly ILotePersist _lotePersist;
        private readonly IGeralPersist _geralPersist;
        private IMapper _mapper;

        public LoteService(ILotePersist lotePersist, IGeralPersist geralPersist, IMapper mapper)
        {
            _lotePersist = lotePersist;
            _geralPersist = geralPersist;
            _mapper = mapper;
        }

        public async Task<bool> DeleteLote(int eventoId, int loteId)
        {
            try
            {
                var lote = await _lotePersist.GetLoteByIdsAsync(eventoId, loteId);
                if (lote is null)
                    throw new Exception("lote para delete não encontrado");
                _geralPersist.Delete<Lote>(lote);
                return await _geralPersist.SaveChangesAsync();



            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDto> GetLoteByIdsAsync(int eventoId, int loteId)
        {
            try
            {
                var lote = await _lotePersist.GetLoteByIdsAsync(eventoId, loteId);
                if (lote is null)
                    return null;
                var result = _mapper.Map<LoteDto>(lote);
                return result;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDto[]> GetLotesByEventoIdAsync(int eventoId)
        {
            try
            {
                var lotes = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                if (lotes is null || lotes.Count() == 0)
                    return null;
                var result = _mapper.Map<LoteDto[]>(lotes);
                return result;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDto[]> SaveLotes(int eventoId, LoteDto[] models)
        {
            try
            {
                var lotes = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                if (lotes is null)
                    return null;

                foreach (var model in models)
                {
                    if (model.Id == 0)
                    {
                        await AddLote(eventoId, model);
                    }
                    else
                    {
                        await UpdateLote(eventoId, model);
                        //var lote = lotes.FirstOrDefault(lote => lote.Id == model.Id);
                        //model.EventoId = eventoId;
                        //var loteMApper = _mapper.Map(model, lote);
                        //_geralPersist.Update<Lote>(loteMApper);
                        //await _geralPersist.SaveChangesAsync();
                    }
                }
                var loteRetorno = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                return _mapper.Map<LoteDto[]>(loteRetorno);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        private async Task AddLote(int eventoId, LoteDto model)
        {
            try
            {
                var lote = _mapper.Map<Lote>(model);
                lote.EventoId = eventoId;
                _geralPersist.Add<Lote>(lote);
                await _geralPersist.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        internal async Task UpdateLote(int eventoId, LoteDto model)
        {
            try
            {
                var lote = _mapper.Map<Lote>(model);
                model.EventoId = eventoId;
                lote.EventoId = eventoId;
                _geralPersist.Update<Lote>(lote);
                await _geralPersist.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
