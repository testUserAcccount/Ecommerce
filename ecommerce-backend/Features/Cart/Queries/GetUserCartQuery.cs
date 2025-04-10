using MediatR;
using EcommerceProject.Models;

namespace EcommerceProject.Features.Cart.Queries;

public record GetUserCartQuery(int UserId) : IRequest<Models.Cart?>;