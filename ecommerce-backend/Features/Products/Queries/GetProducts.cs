using MediatR;
using EcommerceProject.Models;

namespace EcommerceProject.Features.Products.Queries;

public record GetProductsQuery : IRequest<List<Product>>;