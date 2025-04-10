using MediatR;
using EcommerceProject.Models;

namespace EcommerceProject.Features.Products.Queries;

public record GetProductsByCategoryQuery(int CategoryId) : IRequest<List<Product>>;