using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProEventos.Application.Contratos;
using ProEventos.Domain;
using ProEventos.Persistence;


namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly IEventoService _context;
        public EventosController(IEventoService context)
        {
            _context = context;
        }


        [HttpGet(Name = "GetEvento")]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _context.GetAllEventosAsync(true);
                if (eventos == null) return NotFound("Nenhum evento encontrado.");
                return Ok(eventos);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {

            try
            {
                var evento = await _context.GetEventoByIdAsync(id, true);
                if (evento == null) return NotFound("Nenhum evento por ID encontrado.");
                return Ok(evento);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar evento. Erro: {ex.Message}");
            }
        }
        [HttpGet("{tema}/tema")]
        public async Task<ActionResult> GetByTema(string tema)
        {
            try
            {
                var evento = await _context.GetAllEventosByTemaAsync(tema, true);
                if (evento is null) return BadRequest("Nenhum evento encontrado com o tema encontrados.");
                return Ok(evento);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos por tema. Erro: {ex.Message}");
            }

        }
        [HttpPost]
        public async Task<IActionResult> Post(Evento model)
        {
            try
            {
                var evento = await _context.AddEventos(model);
                if (evento == null) return BadRequest("Erro ao adicionar evento.");
                return Ok(evento);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar adicionar evento. Erro: {ex.Message}");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Evento model)
        {
            try
            {
                var evento = await _context.Update(id, model);
                if (evento == null) return BadRequest("Erro ao atualizar evento.");
                return Ok(evento);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar atualizar evento. Erro: {ex.Message}");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deletado = await _context.DeleteEvento(id);
                if(deletado) return Ok("Deletado com sucesso.");
                else return BadRequest("Erro ao deletar evento.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar deletar evento. Erro: {ex.Message}");
            }
        }
    }
}
