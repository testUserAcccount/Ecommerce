using MediatR;

namespace EcommerceProject.Features.Users.Commands;

public record DeleteUserCommand(int Id) : IRequest;
