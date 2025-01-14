using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Extensions;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using System.Security.Claims;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;

        public AccountController(IAccountService accountService, ITokenService tokenService)
        {
            _accountService = accountService;
            _tokenService = tokenService;
        }
        [HttpGet("GetUser")]
        //[AllowAnonymous]
        public async Task<ActionResult> GetUser()
        {
            try
            {
                var username = User.GetUserName();//User.Identity.Name;
                var user = await _accountService.GetUserByUsernameAsync(username);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar usuário. Erro: {ex.Message}");
            }

        }
        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<ActionResult> Register(UserDto userDto)
        {
            try
            {
                if (await _accountService.UserExists(userDto.UserName))
                    return BadRequest("Usuário já cadastrado!");
                var user = await _accountService.CreateAccountAsync(userDto);
                if (user is not null)
                    return Ok(user);
          
                return BadRequest("Usuario não criado, tente novamente mais tarde!");
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar usuário. Erro: {ex.Message}");
            }
        }
        [HttpPut("UpdateUser")]
       
        public async Task<ActionResult> UpdateUser(UserUpdateDto update)
        {
            try
            {
                var user = await _accountService.GetUserByUsernameAsync(User.GetUserName());
                if (user is null) return Unauthorized("Usuario não localizado");
                var userRetorn = await _accountService.UpdateAccount(update);
                if (userRetorn is  null)
                    return NoContent();
                return Ok(userRetorn);

            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar atualizar usuário. Erro: {ex.Message}");
            }
        }
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult> Login(UserLoginDto userLoginDTO)
        {
            try
            {
                var user = await _accountService.GetUserByUsernameAsync(userLoginDTO.UserName);
                if(user is null)
                    return Unauthorized("Usuário inválido");
                var result = await _accountService.CheckUserPasswordAsync(user, userLoginDTO.Password);
               if(!result.Succeeded) 
                    return Unauthorized();
                return Ok(new
                {
                    userName = user.UserName,
                    primeiroNome = user.PrimeiroNome,
                    token = await _tokenService.CreateToken(user)
                });
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar usuário. Erro: {ex.Message}");
            }
        }
    }
}
