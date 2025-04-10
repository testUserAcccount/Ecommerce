using EcommerceProject.Data;
using EcommerceProject.Models;
using EcommerceProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EcommerceProject.Services.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly ApplicationDbContext _context;
    
    public CategoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<Category>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Categories.ToListAsync(cancellationToken);
    }
    
    public async Task<Category?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Categories.FindAsync(new object[] { id }, cancellationToken);
    }
    
    public async Task<Category?> GetByNameAsync(string name, CancellationToken cancellationToken)
    {
        return await _context.Categories
            .FirstOrDefaultAsync(c => c.CategoryName == name, cancellationToken);
    }
    
    public async Task<Category?> GetWithProductsAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.CategoryID == id, cancellationToken);
    }
    
    public async Task<int> CreateAsync(Category category, CancellationToken cancellationToken)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync(cancellationToken);
        return category.CategoryID;
    }
    
    public async Task UpdateAsync(Category category, CancellationToken cancellationToken)
    {
        _context.Entry(category).State = EntityState.Modified;
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var category = await _context.Categories.FindAsync(new object[] { id }, cancellationToken);
        if (category != null)
        {
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}