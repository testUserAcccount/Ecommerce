using MediatR;
using EcommerceProject.Models;

namespace EcommerceProject.Features.Users.Commands;

public record LoginCommand : IRequest<User?>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}