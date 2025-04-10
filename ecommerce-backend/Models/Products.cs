namespace EcommerceProject.Models;
using System.Text.Json.Serialization;

public class Product
{
    public int ProductID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public int? CategoryID { get; set; }
    public string? ImageURL { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Navigation properties
    [JsonIgnore]
    public Category? Category { get; set; }
    [JsonIgnore]
    public ICollection<OrderItem>? OrderItems { get; set; }
    [JsonIgnore]
    public ICollection<CartItem>? CartItems { get; set; }
}