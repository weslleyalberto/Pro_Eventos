using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        private readonly Evento[] _evento =
        [
            new Evento(){
                EventoId = 1,
                Local = "Belo Horizonte",
                DataEvento = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy"),
                Tema = "Angular 11 e .NET 5",
                QtdPessoas = 250,
                Lote = "1º Lote",
                ImageURL = "foto.jpg"
            },
            new Evento(){
                EventoId = 2,
                Local = "São Paulo",
                DataEvento = DateTime.Now.AddDays(3).ToString("dd/MM/yyyy"),
                Tema = "Angular 11 e .NET 5",
                QtdPessoas = 250,
                Lote = "1º Lote",
                ImageURL = "foto2.jpg"
            },
            new Evento(){
                EventoId = 3,
                Local = "Rio de Janeiro",
                DataEvento = DateTime.Now.AddDays(4).ToString("dd/MM/yyyy"),
                Tema = "Angular 11 e .NET 5",
                QtdPessoas = 250,
                Lote = "1º Lote",
                ImageURL = "foto4.jpg"
            }
        ];

        [HttpGet(Name = "GetEvento")]
        public IEnumerable<Evento> Get()
        {
           return  _evento;
        }
        [HttpGet("{id:int}", Name = "GetEventoById")]
        public Evento? GetById(int id)
        {
            return _evento.FirstOrDefault(evento => evento.EventoId == id);
        }
    }
}
