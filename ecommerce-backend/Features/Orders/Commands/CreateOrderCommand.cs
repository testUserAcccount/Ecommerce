using MediatR;

namespace EcommerceProject.Features.Orders.Commands;

public record CreateOrderCommand : IRequest<int>
{
    public int UserId { get; init; }
    public string PaymentMethod { get; init; } = string.Empty;
}