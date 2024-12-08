﻿using ProEventos.Application.Contratos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IEventoPersist _eventoPersist;

        public EventoService(IGeralPersist geralPersist,IEventoPersist eventoPersist)
        {
            _geralPersist = geralPersist;
            _eventoPersist = eventoPersist;
        }

        public async Task<Evento> AddEventos(Evento model)
        {
            try
            {
                _geralPersist.Add<Evento>(model);
                if(await _geralPersist.SaveChangesAsync())
                {
                    return await _eventoPersist.GetEventoByIdAsync(model.Id, false);
                }
                return null;
            }
            catch(Exception ex)
            {
                throw new Exception("Error ao tentar adicionar : " + ex.Message);
            }
           
        }
        public async Task<Evento> Update(int eventoId, Evento model)
        {
            try
            {
                var evento  = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                if (evento is null) return null;
                model.Id = eventoId;
                _geralPersist.Update(model);
                if (await _geralPersist.SaveChangesAsync())
                {
                    return await _eventoPersist.GetEventoByIdAsync(model.Id, false);
                }
                return null;

            }
            catch(Exception ex)
            {
                throw new Exception("Error ao tentar atualizar : " + ex.Message);
            }
        }

        public  async Task<bool> DeleteEvento(int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                if (evento is null) throw new Exception("Evento para delete não foi localizado.");
                
                _geralPersist.Delete(evento);
                return await _geralPersist.SaveChangesAsync();
               

            }
            catch (Exception ex)
            {
                throw new Exception( ex.Message);
            }
        }

        public async Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(includePalestrantes);
                if (eventos is null) return null;
                return eventos;
            }
            catch (Exception ex)
            {
                throw new Exception( ex.Message);
            }
        }

        public async Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosByTemaAsync(tema,includePalestrantes);
                if (eventos is null) return null;
                return eventos;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Evento> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId,includePalestrantes);
                if (evento is null) return null;
                return evento;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

       
    }
}
