using MediatR;
using EcommerceProject.Models;
using EcommerceProject.Services.Interfaces;

namespace EcommerceProject.Features.Orders.Commands;

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, int>
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICartRepository _cartRepository;
    private readonly IPaymentRepository _paymentRepository;

    public CreateOrderCommandHandler(
        IOrderRepository orderRepository,
        ICartRepository cartRepository,
        IPaymentRepository paymentRepository)
    {
        _orderRepository = orderRepository;
        _cartRepository = cartRepository;
        _paymentRepository = paymentRepository;
    }

    public async Task<int> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // Get user's cart
        var cart = await _cartRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        if (cart == null || cart.CartItems == null || !cart.CartItems.Any())
        {
            throw new InvalidOperationException("Cart is empty");
        }

        // Create order
        var order = new Order
        {
            UserID = request.UserId,
            OrderStatus = "Pending",
            OrderDate = DateTime.UtcNow,
            TotalAmount = cart.CartItems.Sum(ci => ci.Product.Price * ci.Quantity),
            OrderItems = cart.CartItems.Select(ci => new OrderItem
            {
                ProductID = ci.ProductID,
                Quantity = ci.Quantity,
                Price = ci.Product.Price
            }).ToList()
        };

        // Save order
        var orderId = await _orderRepository.CreateAsync(order, cancellationToken);

        // Create payment record
        var payment = new Payment
        {
            OrderID = orderId,
            PaymentMethod = request.PaymentMethod,
            PaymentStatus = "Pending",
            PaymentDate = DateTime.UtcNow
        };

        await _paymentRepository.CreateAsync(payment, cancellationToken);

        // Clear the cart
        await _cartRepository.ClearCartAsync(cart.CartID, cancellationToken);

        return orderId;
    }
}