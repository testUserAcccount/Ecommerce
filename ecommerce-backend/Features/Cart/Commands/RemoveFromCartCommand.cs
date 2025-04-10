using MediatR;

namespace EcommerceProject.Features.Cart.Commands;

public record RemoveFromCartCommand(int CartItemId) : IRequest;