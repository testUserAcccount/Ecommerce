using System.Text.Json.Serialization;

namespace EcommerceProject.Models;

public class CartItem
{
    public int CartItemID { get; set; }
    public int CartID { get; set; }
    public int ProductID { get; set; }
    public int Quantity { get; set; }
    public DateTime AddedAt { get; set; }
    
    // Navigation properties
    [JsonIgnore]
    public Cart Cart { get; set; } = null!;
    // Remove JsonIgnore from Product to include it in API responses
    public Product Product { get; set; } = null!;
}