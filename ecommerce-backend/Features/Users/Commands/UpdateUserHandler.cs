using MediatR;
using EcommerceProject.Services.Interfaces;

namespace EcommerceProject.Features.Users.Commands;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand>
{
    private readonly IUserRepository _userRepository;

    public UpdateUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken);
        if (user == null) throw new KeyNotFoundException($"User with ID {request.Id} not found");

        // Updated to use FirstName and LastName fields instead of FullName
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Email = request.Email;
        user.PhoneNumber = request.PhoneNumber;
        user.Address = request.Address;

        await _userRepository.UpdateAsync(user, cancellationToken);
    }
}
