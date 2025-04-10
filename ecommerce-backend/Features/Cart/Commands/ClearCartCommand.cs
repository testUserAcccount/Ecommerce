using MediatR;

namespace EcommerceProject.Features.Cart.Commands;

public record ClearCartCommand(int CartId) : IRequest;