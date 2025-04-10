using MediatR;
using EcommerceProject.Services.Interfaces;

namespace EcommerceProject.Features.Categories.Commands;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand>
{
    private readonly ICategoryRepository _categoryRepository;

    public DeleteCategoryCommandHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetWithProductsAsync(request.Id, cancellationToken);
        if (category == null)
        {
            throw new KeyNotFoundException($"Category with ID {request.Id} not found");
        }

        if (category.Products?.Any() == true)
        {
            throw new InvalidOperationException("Cannot delete category with associated products");
        }

        await _categoryRepository.DeleteAsync(request.Id, cancellationToken);
    }
}