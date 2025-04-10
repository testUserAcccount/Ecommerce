using MediatR;
using EcommerceProject.Models;
using EcommerceProject.Services.Interfaces;

namespace EcommerceProject.Features.Users.Commands;

public class LoginCommandHandler : IRequestHandler<LoginCommand, User?>
{
    private readonly IUserRepository _userRepository;

    public LoginCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User?> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        
        if (user == null)
        {
            return null;
        }

        // Simple password comparison (no hashing as per requirement)
        if (user.PasswordHash == request.Password)
        {
            return user;
        }
        
        return null;
    }
}