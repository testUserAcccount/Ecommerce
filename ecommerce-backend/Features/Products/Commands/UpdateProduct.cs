using MediatR;
using Microsoft.AspNetCore.Http;

namespace EcommerceProject.Features.Products.Commands;

public record UpdateProductCommand : IRequest<Unit>
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int StockQuantity { get; init; }
    public IFormFile? Image { get; init; }
    public int CategoryId { get; init; }
}