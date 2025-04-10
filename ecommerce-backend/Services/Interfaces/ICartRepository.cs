using EcommerceProject.Models;

namespace EcommerceProject.Services.Interfaces;

public interface ICartRepository
{
    Task<Cart?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<Cart?> GetByUserIdAsync(int userId, CancellationToken cancellationToken);
    Task<Cart?> GetWithItemsAsync(int id, CancellationToken cancellationToken);
    Task<int> CreateAsync(Cart cart, CancellationToken cancellationToken);
    Task UpdateAsync(Cart cart, CancellationToken cancellationToken);
    Task DeleteAsync(int id, CancellationToken cancellationToken);
    Task AddItemAsync(CartItem item, CancellationToken cancellationToken);
    Task UpdateItemAsync(CartItem item, CancellationToken cancellationToken);
    Task RemoveItemAsync(int cartItemId, CancellationToken cancellationToken);
    Task ClearCartAsync(int cartId, CancellationToken cancellationToken);
}