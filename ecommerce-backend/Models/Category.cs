using System.Text.Json.Serialization;

namespace EcommerceProject.Models;

public class Category
{
    public int CategoryID { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Navigation properties
    [JsonIgnore]
    public ICollection<Product>? Products { get; set; }
}