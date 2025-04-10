namespace EcommerceProject.Models;

public class Payment
{
    public int PaymentID { get; set; }
    public int OrderID { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = "Pending";
    public DateTime PaymentDate { get; set; }
    
    // Navigation properties
    public Order Order { get; set; } = null!;
    public Receipt? Receipt { get; set; }
}