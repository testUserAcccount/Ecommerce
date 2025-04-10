namespace EcommerceProject.Models;

public class Receipt
{
    public int ReceiptID { get; set; }
    public int PaymentID { get; set; }
    public int OrderID { get; set; }
    public int UserID { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime ReceiptDate { get; set; }
    
    // Navigation properties
    public Payment Payment { get; set; } = null!;
    public Order Order { get; set; } = null!;
    public User User { get; set; } = null!;
}