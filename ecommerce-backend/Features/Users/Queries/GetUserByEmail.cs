using MediatR;
using EcommerceProject.Models;

namespace EcommerceProject.Features.Users.Queries;

public record GetUserByEmailQuery(string Email) : IRequest<User?>;
