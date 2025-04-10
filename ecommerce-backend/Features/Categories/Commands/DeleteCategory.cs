using MediatR;

namespace EcommerceProject.Features.Categories.Commands;

public record DeleteCategoryCommand(int Id) : IRequest;