using EcommerceProject.Data;
using EcommerceProject.Models;
using EcommerceProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EcommerceProject.Services.Repositories;

public class CartRepository : ICartRepository
{
    private readonly ApplicationDbContext _context;
    
    public CartRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<Cart?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Carts.FindAsync(new object[] { id }, cancellationToken);
    }
    
    public async Task<Cart?> GetByUserIdAsync(int userId, CancellationToken cancellationToken)
    {
        return await _context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserID == userId, cancellationToken);
    }
    
    public async Task<Cart?> GetWithItemsAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.CartID == id, cancellationToken);
    }
    
    public async Task<int> CreateAsync(Cart cart, CancellationToken cancellationToken)
    {
        _context.Carts.Add(cart);
        await _context.SaveChangesAsync(cancellationToken);
        return cart.CartID;
    }
    
    public async Task UpdateAsync(Cart cart, CancellationToken cancellationToken)
    {
        _context.Entry(cart).State = EntityState.Modified;
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var cart = await _context.Carts.FindAsync(new object[] { id }, cancellationToken);
        if (cart != null)
        {
            _context.Carts.Remove(cart);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
    
    public async Task AddItemAsync(CartItem item, CancellationToken cancellationToken)
    {
        // Check if the item already exists in cart
        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.CartID == item.CartID && ci.ProductID == item.ProductID, cancellationToken);
        
        if (existingItem != null)
        {
            // Update quantity if item exists
            existingItem.Quantity += item.Quantity;
            _context.CartItems.Update(existingItem);
        }
        else
        {
            // Add new item
            _context.CartItems.Add(item);
        }
        
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task UpdateItemAsync(CartItem item, CancellationToken cancellationToken)
    {
        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.CartItemID == item.CartItemID, cancellationToken);
            
        if (existingItem == null)
        {
            throw new KeyNotFoundException($"Cart item with ID {item.CartItemID} not found");
        }

        // Only update the quantity
        existingItem.Quantity = item.Quantity;
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task RemoveItemAsync(int cartItemId, CancellationToken cancellationToken)
    {
        var item = await _context.CartItems.FindAsync(new object[] { cartItemId }, cancellationToken);
        if (item != null)
        {
            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
    
    public async Task ClearCartAsync(int cartId, CancellationToken cancellationToken)
    {
        var items = await _context.CartItems
            .Where(ci => ci.CartID == cartId)
            .ToListAsync(cancellationToken);
        
        _context.CartItems.RemoveRange(items);
        await _context.SaveChangesAsync(cancellationToken);
    }
}