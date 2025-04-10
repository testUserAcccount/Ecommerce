using MediatR;
using EcommerceProject.Models;
using EcommerceProject.Services.Interfaces;

namespace EcommerceProject.Features.Cart.Queries;

public class GetUserCartQueryHandler : IRequestHandler<GetUserCartQuery, Models.Cart?>
{
    private readonly ICartRepository _cartRepository;

    public GetUserCartQueryHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<Models.Cart?> Handle(GetUserCartQuery request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        if (cart != null)
        {
            // Load cart with items
            cart = await _cartRepository.GetWithItemsAsync(cart.CartID, cancellationToken);
        }
        return cart;
    }
}