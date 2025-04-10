using MediatR;
using EcommerceProject.Models;
using EcommerceProject.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;

namespace EcommerceProject.Features.Products.Commands;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, Unit>
{
    private readonly IProductRepository _productRepository;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public UpdateProductCommandHandler(
        IProductRepository productRepository,
        IWebHostEnvironment webHostEnvironment)
    {
        _productRepository = productRepository;
        _webHostEnvironment = webHostEnvironment;
    }

    public async Task<Unit> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var existingProduct = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (existingProduct == null)
        {
            throw new KeyNotFoundException($"Product with ID {request.Id} not found");
        }

        // Handle image upload if a new image is provided
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

            // Delete old image if it exists
            if (!string.IsNullOrEmpty(existingProduct.ImageURL))
            {
                var oldImagePath = Path.Combine(_webHostEnvironment.WebRootPath, existingProduct.ImageURL.TrimStart('/'));
                if (File.Exists(oldImagePath))
                {
                    File.Delete(oldImagePath);
                }
            }

            existingProduct.ImageURL = $"/images/products/{uniqueFileName}";
        }

        existingProduct.Name = request.Name;
        existingProduct.Description = request.Description;
        existingProduct.Price = request.Price;
        existingProduct.StockQuantity = request.StockQuantity;
        existingProduct.CategoryID = request.CategoryId;

        await _productRepository.UpdateAsync(existingProduct, cancellationToken);
        return Unit.Value;
    }
}