using EcommerceProject.Models;

namespace EcommerceProject.Services.Interfaces;

public interface IReceiptRepository
{
    Task<Receipt?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<Receipt?> GetByPaymentIdAsync(int paymentId, CancellationToken cancellationToken);
    Task<Receipt?> GetByOrderIdAsync(int orderId, CancellationToken cancellationToken);
    Task<List<Receipt>> GetByUserIdAsync(int userId, CancellationToken cancellationToken);
    Task<int> CreateAsync(Receipt receipt, CancellationToken cancellationToken);
    Task UpdateAsync(Receipt receipt, CancellationToken cancellationToken);
    Task DeleteAsync(int id, CancellationToken cancellationToken);
}