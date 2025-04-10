using MediatR;
using EcommerceProject.Models;

namespace EcommerceProject.Features.Products.Queries;

public record GetProductByIdQuery(int Id) : IRequest<Product?>;