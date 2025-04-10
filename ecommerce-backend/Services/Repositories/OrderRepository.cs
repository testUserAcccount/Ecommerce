using EcommerceProject.Data;
using EcommerceProject.Models;
using EcommerceProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EcommerceProject.Services.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly ApplicationDbContext _context;
    
    public OrderRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<Order>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Orders
            .Include(o => o.User)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<Order?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems!)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.OrderID == id, cancellationToken);
    }
    
    public async Task<List<Order>> GetByUserIdAsync(int userId, CancellationToken cancellationToken)
    {
        return await _context.Orders
            .Where(o => o.UserID == userId)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<Order?> GetWithItemsAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems!)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.OrderID == id, cancellationToken);
    }
    
    public async Task<Order?> GetWithPaymentAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.Payment)
            .FirstOrDefaultAsync(o => o.OrderID == id, cancellationToken);
    }
    
    public async Task<int> CreateAsync(Order order, CancellationToken cancellationToken)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync(cancellationToken);
        return order.OrderID;
    }
    
    public async Task UpdateAsync(Order order, CancellationToken cancellationToken)
    {
        _context.Entry(order).State = EntityState.Modified;
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var order = await _context.Orders.FindAsync(new object[] { id }, cancellationToken);
        if (order != null)
        {
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}