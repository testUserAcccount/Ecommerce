using EcommerceProject.Models;

namespace EcommerceProject.Services.Interfaces;

public interface IUserRepository
{
    Task<List<User>> GetAllAsync(CancellationToken cancellationToken);
    Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken);
    Task<User?> GetWithCartAsync(int id, CancellationToken cancellationToken);
    Task<User?> GetWithOrdersAsync(int id, CancellationToken cancellationToken);
    Task<int> CreateAsync(User user, CancellationToken cancellationToken);
    Task UpdateAsync(User user, CancellationToken cancellationToken);
    Task DeleteAsync(int id, CancellationToken cancellationToken);
}
