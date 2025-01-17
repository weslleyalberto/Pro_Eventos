﻿using Microsoft.AspNetCore.Mvc;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;

namespace ProEventos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LotesController : ControllerBase
    {
        private readonly ILoteService _loteService;
       
        public LotesController(ILoteService loteService
            )
        {
            _loteService = loteService;
           
        }
        [HttpGet("{eventoId}")]
        public async Task<ActionResult> Get(int eventoId)
        {
            try
            {
                var lotes = await _loteService.GetLotesByEventoIdAsync(eventoId);
                if (lotes is null)
                    return NoContent();
                return Ok(lotes);   
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar lotes. Erro: {ex.Message}");
            }
           
        }
        [HttpPut("{eventoId}")]
        public async Task<ActionResult> SaveLotes(int eventoId, LoteDto[] models)
        {
            try
            {
                var lotes = await _loteService.SaveLotes(eventoId, models);
                if (lotes is null)
                    return NoContent();
                return Ok(lotes);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar salvar lotes. Erro: {ex.Message}");
            }
        }
        [HttpDelete("{eventoId}/{loteId}")]
        public async Task<ActionResult> Delete(int eventoId, int loteId)
        {
            try
            {
               var lote = await _loteService.GetLoteByIdsAsync(eventoId, loteId);
                if (lote is null)
                    return NoContent();
                return await  _loteService.DeleteLote(lote.EventoId, lote.Id) ? Ok (new { message = "Lote Deletado" })
                    : throw new Exception("Ocorreu um problem não especifico ao tentar deletar evento.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar deletar lotes. Erro: {ex.Message}");
            }
            
        }
    }
}
