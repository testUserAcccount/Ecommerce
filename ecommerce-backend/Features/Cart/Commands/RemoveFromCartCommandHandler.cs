using MediatR;
using EcommerceProject.Services.Interfaces;

namespace EcommerceProject.Features.Cart.Commands;

public class RemoveFromCartCommandHandler : IRequestHandler<RemoveFromCartCommand>
{
    private readonly ICartRepository _cartRepository;

    public RemoveFromCartCommandHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task Handle(RemoveFromCartCommand request, CancellationToken cancellationToken)
    {
        await _cartRepository.RemoveItemAsync(request.CartItemId, cancellationToken);
    }
}