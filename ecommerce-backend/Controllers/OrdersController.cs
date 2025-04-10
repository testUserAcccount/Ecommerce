using MediatR;
using Microsoft.AspNetCore.Mvc;
using EcommerceProject.Features.Orders.Commands;
using EcommerceProject.Features.Orders.Queries;

namespace EcommerceProject.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CreateOrderCommand command, CancellationToken cancellationToken)
    {
        try
        {
            var orderId = await _mediator.Send(command, cancellationToken);
            return Ok(new { orderId });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var query = new GetOrderByIdQuery { OrderId = id };
        var order = await _mediator.Send(query);

        if (order == null)
        {
            return NotFound();
        }

        return Ok(order);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserOrders(int userId)
    {
        var query = new GetUserOrdersQuery { UserId = userId };
        var orders = await _mediator.Send(query);
        return Ok(orders);
    }
}