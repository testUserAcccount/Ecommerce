using MediatR;
using Microsoft.EntityFrameworkCore;
using EcommerceProject.Data;
using EcommerceProject.Models;
using EcommerceProject.Services.Interfaces;

namespace EcommerceProject.Features.Orders.Queries
{
    public class GetUserOrdersQuery : IRequest<List<Order>?>
    {
        public int UserId { get; set; }
    }

    public class GetUserOrdersQueryHandler : IRequestHandler<GetUserOrdersQuery, List<Order>?>
    {
        private readonly IOrderRepository _orderRepository;

        public GetUserOrdersQueryHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<List<Order>?> Handle(GetUserOrdersQuery request, CancellationToken cancellationToken)
        {
            return await _orderRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        }
    }
}