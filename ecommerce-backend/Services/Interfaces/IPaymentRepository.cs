using EcommerceProject.Models;

namespace EcommerceProject.Services.Interfaces;

public interface IPaymentRepository
{
    Task<Payment?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<Payment?> GetByOrderIdAsync(int orderId, CancellationToken cancellationToken);
    Task<Payment?> GetWithReceiptAsync(int id, CancellationToken cancellationToken);
    Task<int> CreateAsync(Payment payment, CancellationToken cancellationToken);
    Task UpdateAsync(Payment payment, CancellationToken cancellationToken);
    Task DeleteAsync(int id, CancellationToken cancellationToken);
}