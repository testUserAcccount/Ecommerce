using EcommerceProject.Data;
using EcommerceProject.Models;
using EcommerceProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EcommerceProject.Services.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context; 
    }

    public async Task<List<User>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Users.ToListAsync(cancellationToken);
    }

    public async Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Users.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }
    
    public async Task<User?> GetWithCartAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Users
            .Include(u => u.Cart!)
            .ThenInclude(c => c.CartItems!)
            .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(u => u.UserID == id, cancellationToken);
    }

    public async Task<User?> GetWithOrdersAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Users
            .Include(u => u.Orders!)
            .FirstOrDefaultAsync(u => u.UserID == id, cancellationToken);
    }

    public async Task<int> CreateAsync(User user, CancellationToken cancellationToken)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
        return user.UserID;
    }

    public async Task UpdateAsync(User user, CancellationToken cancellationToken)
    {
        _context.Entry(user).State = EntityState.Modified;
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FindAsync(new object[] { id }, cancellationToken);
        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
