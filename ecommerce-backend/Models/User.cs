using System.Text.Json.Serialization;

namespace EcommerceProject.Models;

public class User
{
    public int UserID { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    [JsonIgnore]
    public Cart? Cart { get; set; }
    [JsonIgnore]
    public ICollection<Order>? Orders { get; set; }
    [JsonIgnore]
    public ICollection<Receipt>? Receipts { get; set; }
}
