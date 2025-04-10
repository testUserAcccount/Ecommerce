using MediatR;
using EcommerceProject.Models;

namespace EcommerceProject.Features.Users.Queries;

public record GetAllUsersQuery : IRequest<List<User>>;
