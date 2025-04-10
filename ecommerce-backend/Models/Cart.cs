using System.Text.Json.Serialization;

namespace EcommerceProject.Models;

public class Cart
{
    public int CartID { get; set; }
    public int UserID { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Navigation properties
    [JsonIgnore]
    public User User { get; set; } = null!;
    // Remove JsonIgnore from CartItems to include them in API responses
    public ICollection<CartItem>? CartItems { get; set; }
}