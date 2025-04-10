using MediatR;
using Microsoft.AspNetCore.Mvc;
using EcommerceProject.Features.Products.Commands;
using EcommerceProject.Features.Products.Queries;

namespace EcommerceProject.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts(CancellationToken cancellationToken)
    {
        var products = await _mediator.Send(new GetProductsQuery(), cancellationToken);
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id, CancellationToken cancellationToken)
    {
        var product = await _mediator.Send(new GetProductByIdQuery(id), cancellationToken);
        if (product == null)
        {
            return NotFound();
        }
        return Ok(product);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateProduct(
        [FromForm] string name,
        [FromForm] string description,
        [FromForm] decimal price,
        [FromForm] int stockQuantity,
        [FromForm] int categoryId,
        IFormFile? image,
        CancellationToken cancellationToken)
    {
        var command = new CreateProductCommand
        {
            Name = name,
            Description = description,
            Price = price,
            StockQuantity = stockQuantity,
            CategoryId = categoryId,
            Image = image
        };

        var productId = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetProduct), new { id = productId }, null);
    }

    [HttpPut("{id}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateProduct(
        int id,
        [FromForm] string name,
        [FromForm] string description,
        [FromForm] decimal price,
        [FromForm] int stockQuantity,
        [FromForm] int categoryId,
        IFormFile? image,
        CancellationToken cancellationToken)
    {
        var command = new UpdateProductCommand
        {
            Id = id,
            Name = name,
            Description = description,
            Price = price,
            StockQuantity = stockQuantity,
            CategoryId = categoryId,
            Image = image
        };

        try
        {
            await _mediator.Send(command, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteProductCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetProductsByCategory(int categoryId, CancellationToken cancellationToken)
    {
        var products = await _mediator.Send(new GetProductsByCategoryQuery(categoryId), cancellationToken);
        return Ok(products);
    }
}