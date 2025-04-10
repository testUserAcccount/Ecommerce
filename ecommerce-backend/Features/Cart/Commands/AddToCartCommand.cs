using MediatR;

namespace EcommerceProject.Features.Cart.Commands;

public record AddToCartCommand : IRequest
{
    public int UserId { get; init; }
    public int ProductId { get; init; }
    public int Quantity { get; init; }
}