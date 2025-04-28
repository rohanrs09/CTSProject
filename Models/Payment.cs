using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartHotelBookingSystem.Models
{
    public class Payment
    {
        [Key]
        public int PaymentID { get; set; }
        
        [Required]
        public string UserID { get; set; } = string.Empty;
        
        [ForeignKey("UserID")]
        public User? User { get; set; }
        
        [Required]
        public int BookingID { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;
        
        public Booking? Booking { get; set; }
    }
} 