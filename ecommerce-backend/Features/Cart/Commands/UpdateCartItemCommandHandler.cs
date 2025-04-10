using MediatR;
using EcommerceProject.Services.Interfaces;

namespace EcommerceProject.Features.Cart.Commands;

public class UpdateCartItemCommandHandler : IRequestHandler<UpdateCartItemCommand>
{
    private readonly ICartRepository _cartRepository;

    public UpdateCartItemCommandHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task Handle(UpdateCartItemCommand request, CancellationToken cancellationToken)
    {
        var item = new Models.CartItem
        {
            CartItemID = request.CartItemId,
            Quantity = request.Quantity
        };

        await _cartRepository.UpdateItemAsync(item, cancellationToken);
    }
}