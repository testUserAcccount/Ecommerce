using MediatR;
using Microsoft.AspNetCore.Mvc;
using EcommerceProject.Features.Cart.Commands;
using EcommerceProject.Features.Cart.Queries;

namespace EcommerceProject.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly IMediator _mediator;

    public CartController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserCart(int userId, CancellationToken cancellationToken)
    {
        var cart = await _mediator.Send(new GetUserCartQuery(userId), cancellationToken);
        if (cart == null)
        {
            return NotFound();
        }
        return Ok(cart);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartCommand command, CancellationToken cancellationToken)
    {
        await _mediator.Send(command, cancellationToken);
        return Ok();
    }

    [HttpPut("items/{cartItemId}")]
    public async Task<IActionResult> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemCommand command, CancellationToken cancellationToken)
    {
        if (cartItemId != command.CartItemId)
        {
            return BadRequest("ID mismatch between route and body");
        }
        await _mediator.Send(command, cancellationToken);
        return NoContent();
    }

    [HttpDelete("items/{cartItemId}")]
    public async Task<IActionResult> RemoveFromCart(int cartItemId, CancellationToken cancellationToken)
    {
        await _mediator.Send(new RemoveFromCartCommand(cartItemId), cancellationToken);
        return NoContent();
    }

    [HttpDelete("{cartId}/clear")]
    public async Task<IActionResult> ClearCart(int cartId, CancellationToken cancellationToken)
    {
        await _mediator.Send(new ClearCartCommand(cartId), cancellationToken);
        return NoContent();
    }
}