using MediatR;
using EcommerceProject.Models;
using EcommerceProject.Services.Interfaces;

namespace EcommerceProject.Features.Products.Queries;

public class GetProductsByCategoryHandler : IRequestHandler<GetProductsByCategoryQuery, List<Product>>
{
    private readonly IProductRepository _productRepository;

    public GetProductsByCategoryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<List<Product>> Handle(GetProductsByCategoryQuery request, CancellationToken cancellationToken)
    {
        return await _productRepository.GetByCategoryAsync(request.CategoryId, cancellationToken);
    }
}