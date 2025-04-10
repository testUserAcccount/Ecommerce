using MediatR;
using EcommerceProject.Models;

namespace EcommerceProject.Features.Users.Queries;

public record GetUserByIdQuery(int Id) : IRequest<User?>;
