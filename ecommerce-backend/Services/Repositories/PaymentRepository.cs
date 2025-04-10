using EcommerceProject.Data;
using EcommerceProject.Models;
using EcommerceProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EcommerceProject.Services.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly ApplicationDbContext _context;
    
    public PaymentRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<Payment?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Payments
            .Include(p => p.Order)
            .FirstOrDefaultAsync(p => p.PaymentID == id, cancellationToken);
    }
    
    public async Task<Payment?> GetByOrderIdAsync(int orderId, CancellationToken cancellationToken)
    {
        return await _context.Payments
            .FirstOrDefaultAsync(p => p.OrderID == orderId, cancellationToken);
    }
    
    public async Task<Payment?> GetWithReceiptAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Payments
            .Include(p => p.Order)
            .Include(p => p.Receipt)
            .FirstOrDefaultAsync(p => p.PaymentID == id, cancellationToken);
    }
    
    public async Task<int> CreateAsync(Payment payment, CancellationToken cancellationToken)
    {
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync(cancellationToken);
        return payment.PaymentID;
    }
    
    public async Task UpdateAsync(Payment payment, CancellationToken cancellationToken)
    {
        _context.Entry(payment).State = EntityState.Modified;
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var payment = await _context.Payments.FindAsync(new object[] { id }, cancellationToken);
        if (payment != null)
        {
            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}