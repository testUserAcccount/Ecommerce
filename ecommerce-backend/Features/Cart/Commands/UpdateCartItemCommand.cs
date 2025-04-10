using MediatR;

namespace EcommerceProject.Features.Cart.Commands;

public record UpdateCartItemCommand : IRequest
{
    public int CartItemId { get; init; }
    public int Quantity { get; init; }
}