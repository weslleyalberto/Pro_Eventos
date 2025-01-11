using Microsoft.AspNetCore.Identity;
using ProEventos.Domain.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProEventos.Domain.Identity
{
    public class User : IdentityUser<int>
    {
        public string PrimeiroNome { get; set; }
        public string UltimoNome { get; set; }
        public Titulo Titulo { get; set; }
        public string Descricao { get; set; }
        public Funcao Funcao { get; set; }
        public string ImagemPErfil { get; set; }
        public IEnumerable<UserRole> UserRoles { get; set; }
        [NotMapped]
        public string NomeCompleto { get => PrimeiroNome + UltimoNome; }
    }
}
