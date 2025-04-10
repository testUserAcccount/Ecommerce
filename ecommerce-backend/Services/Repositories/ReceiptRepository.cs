using EcommerceProject.Data;
using EcommerceProject.Models;
using EcommerceProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EcommerceProject.Services.Repositories;

public class ReceiptRepository : IReceiptRepository
{
    private readonly ApplicationDbContext _context;
    
    public ReceiptRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<Receipt?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Receipts
            .Include(r => r.Order)
            .Include(r => r.Payment)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.ReceiptID == id, cancellationToken);
    }
    
    public async Task<Receipt?> GetByPaymentIdAsync(int paymentId, CancellationToken cancellationToken)
    {
        return await _context.Receipts
            .Include(r => r.Order)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.PaymentID == paymentId, cancellationToken);
    }
    
    public async Task<Receipt?> GetByOrderIdAsync(int orderId, CancellationToken cancellationToken)
    {
        return await _context.Receipts
            .Include(r => r.Payment)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.OrderID == orderId, cancellationToken);
    }
    
    public async Task<List<Receipt>> GetByUserIdAsync(int userId, CancellationToken cancellationToken)
    {
        return await _context.Receipts
            .Include(r => r.Order)
            .Include(r => r.Payment)
            .Where(r => r.UserID == userId)
            .OrderByDescending(r => r.ReceiptDate)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<int> CreateAsync(Receipt receipt, CancellationToken cancellationToken)
    {
        _context.Receipts.Add(receipt);
        await _context.SaveChangesAsync(cancellationToken);
        return receipt.ReceiptID;
    }
    
    public async Task UpdateAsync(Receipt receipt, CancellationToken cancellationToken)
    {
        _context.Entry(receipt).State = EntityState.Modified;
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var receipt = await _context.Receipts.FindAsync(new object[] { id }, cancellationToken);
        if (receipt != null)
        {
            _context.Receipts.Remove(receipt);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}