using MediatR;
using EcommerceProject.Models;

namespace EcommerceProject.Features.Categories.Queries;

public record GetCategoriesQuery : IRequest<List<Category>>;