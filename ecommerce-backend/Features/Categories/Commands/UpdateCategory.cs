using MediatR;

namespace EcommerceProject.Features.Categories.Commands;

public record UpdateCategoryCommand : IRequest
{
    public int Id { get; init; }
    public string CategoryName { get; init; } = string.Empty;
    public string? Description { get; init; }
}