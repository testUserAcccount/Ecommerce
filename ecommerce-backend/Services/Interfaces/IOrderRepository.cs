using EcommerceProject.Models;

namespace EcommerceProject.Services.Interfaces;

public interface IOrderRepository
{
    Task<List<Order>> GetAllAsync(CancellationToken cancellationToken);
    Task<Order?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<List<Order>> GetByUserIdAsync(int userId, CancellationToken cancellationToken);
    Task<Order?> GetWithItemsAsync(int id, CancellationToken cancellationToken);
    Task<Order?> GetWithPaymentAsync(int id, CancellationToken cancellationToken);
    Task<int> CreateAsync(Order order, CancellationToken cancellationToken);
    Task UpdateAsync(Order order, CancellationToken cancellationToken);
    Task DeleteAsync(int id, CancellationToken cancellationToken);
}