using MediatR;

namespace EcommerceProject.Features.Categories.Commands;

public record CreateCategoryCommand : IRequest<int>
{
    public string CategoryName { get; init; } = string.Empty;
    public string? Description { get; init; }
}