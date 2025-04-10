using System.Text.Json.Serialization;

namespace EcommerceProject.Models;

public class Order
{
    public int OrderID { get; set; }
    public int UserID { get; set; }
    public string OrderStatus { get; set; } = "Pending";
    public decimal TotalAmount { get; set; }
    public DateTime OrderDate { get; set; }
    
    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<OrderItem>? OrderItems { get; set; }
    [JsonIgnore]
    public Payment? Payment { get; set; }
    [JsonIgnore]
    public Receipt? Receipt { get; set; }
}