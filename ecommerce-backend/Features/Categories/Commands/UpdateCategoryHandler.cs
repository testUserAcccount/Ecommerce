using MediatR;
using EcommerceProject.Services.Interfaces;

namespace EcommerceProject.Features.Categories.Commands;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand>
{
    private readonly ICategoryRepository _categoryRepository;

    public UpdateCategoryCommandHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);
        if (category == null)
        {
            throw new KeyNotFoundException($"Category with ID {request.Id} not found");
        }

        category.CategoryName = request.CategoryName;
        category.Description = request.Description;

        await _categoryRepository.UpdateAsync(category, cancellationToken);
    }
}