using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Extensions;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;


namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly IEventoService _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public EventosController(IEventoService context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _hostEnvironment = webHostEnvironment;
        }


        [HttpGet(Name = "GetEvento")]
        public async Task<IActionResult> Get()
        {
            try
            {

                var eventos = await _context.GetAllEventosAsync(User.GetUserId(), true);
                if (eventos == null) return NoContent();
                
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
                var evento = await _context.GetEventoByIdAsync(User.GetUserId(),id, true);
                if (evento == null) return NoContent();
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
                var evento = await _context.GetAllEventosByTemaAsync(User.GetUserId(),tema, true);
                if (evento is null) return NoContent();
                return Ok(evento);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos por tema. Erro: {ex.Message}");
            }

        }
        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                var evento = await _context.AddEventos(User.GetUserId(),model);
                if (evento == null) return NoContent();
                return Ok(evento);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar adicionar evento. Erro: {ex.Message}");
            }
        }
        [HttpPost("upload-image/{eventoId}")]
        public async Task<IActionResult> UploadImage(int eventoId)
        {
            try
            {
                var evento = await _context.GetEventoByIdAsync(User.GetUserId(),eventoId, true);
                if (evento == null) return NoContent();
                var file = Request.Form.Files[0];
                if(file.Length > 0)
                {
                    DeleteImage(evento.ImageURL);
                    evento.ImageURL = await SaveImage(file);
                }
              
                var eventoRetorno = await _context.Update(User.GetUserId(), eventoId, evento);
                return Ok(eventoRetorno);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar adicionar evento. Erro: {ex.Message}");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, EventoDto model)
        {
            try
            {
                var evento = await _context.Update(User.GetUserId(), id, model);
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
                var deletado = await _context.DeleteEvento(User.GetUserId(),id);
                if(deletado) return Ok( new {message = "Deletado"});
                else return BadRequest("Erro ao deletar evento.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar deletar evento. Erro: {ex.Message}");
            }
        }
        [NonAction]
        private void DeleteImage(string imageName)
        {
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @"Resources\Images", imageName);
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }
        }
        [NonAction]
        private async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName = new String( Path.GetFileNameWithoutExtension(imageFile.Name)
                .Take(10).ToArray()).Replace(' ','-');
            //mascara do vinícios yymmssfff
            imageName = $"{imageName}{DateTime.UtcNow.ToString("yymmssfff")}{Path.GetExtension(imageFile.FileName)}";
            var imagePAth = Path.Combine(_hostEnvironment.ContentRootPath, @"Resources/Images", imageName);
            using(var fileStream = new FileStream(imagePAth, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }
            return imageName;
        }
    }
}
