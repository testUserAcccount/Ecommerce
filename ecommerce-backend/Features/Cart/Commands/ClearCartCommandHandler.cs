using MediatR;
using EcommerceProject.Services.Interfaces;

namespace EcommerceProject.Features.Cart.Commands;

public class ClearCartCommandHandler : IRequestHandler<ClearCartCommand>
{
    private readonly ICartRepository _cartRepository;

    public ClearCartCommandHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task Handle(ClearCartCommand request, CancellationToken cancellationToken)
    {
        await _cartRepository.ClearCartAsync(request.CartId, cancellationToken);
    }
}