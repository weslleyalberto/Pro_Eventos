using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório!")]
        public string Local { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório!")]
        public string DataEvento { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório!"),
        //MinLength(3, ErrorMessage ="O campo {0} deve ter no mínimo {1} caracteres"),
        //MaxLength(50, ErrorMessage ="O campo {0} deve ter no Máximo {1} caracteres")]
        StringLength(50, MinimumLength = 3, ErrorMessage = "Intervalo permitido de  {2} a {1} caracteres")]
        public string Tema { get; set; }
        [Display(Name = "Qtd Pessoas")]
        [Range(1, 300, ErrorMessage = "O campo {0} não pode ter menos de {1} e mais de {2} pessoas.")]
        public int QtdPessoas { get; set; }
        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$", ErrorMessage = "Não é uma imagem válida. (gif, jpg, jpeg, bmp ou png)")]
        public string ImageURL { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        [Phone(ErrorMessage = "O campo {0} está em formato inválido!")]

        public string Telefone { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        [Display(Name = "e-mail")]
        [EmailAddress(ErrorMessage = "O campo {0} está em formato inválido!")]
        public string Email { get; set; }
        public IEnumerable<LoteDto>? Lotes { get; set; }
        public IEnumerable<RedeSocialDto>? RedesSociais { get; set; }
        public IEnumerable<PalestranteDto>? Palestrantes { get; set; }

        public EventoDto()
        {
            Lotes = new List<LoteDto>();
            RedesSociais = new List<RedeSocialDto>();
            Palestrantes = new List<PalestranteDto>();
        }
    }
}
