using MediatR;

namespace EcommerceProject.Features.Products.Commands;

public record DeleteProductCommand(int Id) : IRequest<Unit>;