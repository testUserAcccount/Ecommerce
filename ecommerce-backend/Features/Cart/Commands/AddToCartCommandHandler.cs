using MediatR;
using EcommerceProject.Models;
using EcommerceProject.Services.Interfaces;

namespace EcommerceProject.Features.Cart.Commands;

public class AddToCartCommandHandler : IRequestHandler<AddToCartCommand>
{
    private readonly ICartRepository _cartRepository;

    public AddToCartCommandHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task Handle(AddToCartCommand request, CancellationToken cancellationToken)
    {
        // Get or create cart for user
        var cart = await _cartRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        
        if (cart == null)
        {
            // Create new cart if it doesn't exist
            cart = new Models.Cart
            {
                UserID = request.UserId,
                CreatedAt = DateTime.UtcNow
            };
            var cartId = await _cartRepository.CreateAsync(cart, cancellationToken);
            cart.CartID = cartId;
        }

        // Create cart item
        var cartItem = new CartItem
        {
            CartID = cart.CartID,
            ProductID = request.ProductId,
            Quantity = request.Quantity,
            AddedAt = DateTime.UtcNow
        };

        await _cartRepository.AddItemAsync(cartItem, cancellationToken);
    }
}