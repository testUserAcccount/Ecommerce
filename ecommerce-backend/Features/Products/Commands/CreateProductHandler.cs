using MediatR;
using EcommerceProject.Models;
using EcommerceProject.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace EcommerceProject.Features.Products.Commands;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, int>
{
    private readonly IProductRepository _productRepository;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public CreateProductCommandHandler(
        IProductRepository productRepository,
        IWebHostEnvironment webHostEnvironment)
    {
        _productRepository = productRepository;
        _webHostEnvironment = webHostEnvironment;
    }

    public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var imageUrl = string.Empty;
        if (request.Image != null)
        {
            var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images", "products");
            Directory.CreateDirectory(uploadsFolder); // Create directory if it doesn't exist
            
            // Create unique filename
            var uniqueFileName = $"{Guid.NewGuid()}_{request.Image.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save file
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await request.Image.CopyToAsync(fileStream, cancellationToken);
            }

            imageUrl = $"/images/products/{uniqueFileName}";
        }

        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            // Updated property names to match the model
            ImageURL = imageUrl,
            CategoryID = request.CategoryId,
            CreatedAt = DateTime.UtcNow
        };

        return await _productRepository.CreateAsync(product, cancellationToken);
    }
}