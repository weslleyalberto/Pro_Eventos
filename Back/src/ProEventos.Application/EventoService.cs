using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IEventoPersist _eventoPersist;
        private readonly IMapper _mapper;

        public EventoService(IGeralPersist geralPersist,
            IEventoPersist eventoPersist,
            IMapper mapper)
        {
            _geralPersist = geralPersist;
            _eventoPersist = eventoPersist;
            _mapper = mapper;
        }

        public async Task<EventoDto> AddEventos(int userId, EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);
                evento.UserId = userId;
                _geralPersist.Add<Evento>(evento);
                if(await _geralPersist.SaveChangesAsync())
                {
                    var eventoP = await _eventoPersist.GetEventoByIdAsync(userId,evento.Id, false);
                    return _mapper.Map<EventoDto>(eventoP);
                }
                return null;
            }
            catch(Exception ex)
            {
                throw new Exception("Error ao tentar adicionar : " + ex.Message);
            }
           
        }
        public async Task<EventoDto> Update(int userId, int eventoId, EventoDto model)
        {
            try
            {
                var evento  = await _eventoPersist.GetEventoByIdAsync(userId,eventoId, false);
                if (evento is null) return null;
                model.Id = eventoId;
                model.UserId = userId;
                var eventoModel = _mapper.Map<Evento>(model);
                _geralPersist.Update(eventoModel);
                if (await _geralPersist.SaveChangesAsync())
                {
                    var eventoP = await _eventoPersist.GetEventoByIdAsync(userId, evento.Id, false);
                    return _mapper.Map<EventoDto>(eventoP);
                }
                return null;

            }
            catch(Exception ex)
            {
                throw new Exception("Error ao tentar atualizar : " + ex.Message);
            }
        }

        public  async Task<bool> DeleteEvento(int userId, int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId, false);
                if (evento is null) throw new Exception("Evento para delete não foi localizado.");
                
                _geralPersist.Delete(evento);
                return await _geralPersist.SaveChangesAsync();
               

            }
            catch (Exception ex)
            {
                throw new Exception( ex.Message);
            }
        }

        public async Task<EventoDto[]> GetAllEventosAsync(int userId, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(userId,includePalestrantes);
                if (eventos is null) return null;
                return _mapper.Map<EventoDto[]>(eventos);
               
            }
            catch (Exception ex)
            {
                throw new Exception( ex.Message);
            }
        }

        public async Task<EventoDto[]> GetAllEventosByTemaAsync(int userId, string tema, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosByTemaAsync(userId, tema,includePalestrantes);
                if (eventos is null) return null;
                var resultado = _mapper.Map<EventoDto[]>(eventos);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId,eventoId,includePalestrantes);
                if (evento is null) return null;
                var resultado = _mapper.Map<EventoDto>(evento);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

       
    }
}
