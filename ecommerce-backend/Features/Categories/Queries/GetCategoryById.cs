using MediatR;
using EcommerceProject.Models;

namespace EcommerceProject.Features.Categories.Queries;

public record GetCategoryByIdQuery(int Id) : IRequest<Category?>;