using System.Text.Json.Serialization;

namespace EcommerceProject.Models;

public class OrderItem
{
    public int OrderItemID { get; set; }
    public int OrderID { get; set; }
    public int ProductID { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    
    // Navigation properties
    [JsonIgnore]
    public Order Order { get; set; } = null!;
    // Removed JsonIgnore to include product details in API response
    public Product Product { get; set; } = null!;
}