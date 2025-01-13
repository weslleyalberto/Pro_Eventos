using Microsoft.EntityFrameworkCore;
using ProEventos.Domain.Identity;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
    public class UserPersist : GeralPersist, IUserPersist
    {
        private readonly ProEventosContext _context;
        public UserPersist(ProEventosContext context) : base(context)
        {
            _context = context;
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.SingleOrDefaultAsync(f => f.UserName.ToLower() == username.ToLower());
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        
    }
}
