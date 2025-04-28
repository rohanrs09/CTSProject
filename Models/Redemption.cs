using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartHotelBookingSystem.Models
{
    public class Redemption
    {
        [Key]
        public int RedemptionID { get; set; }
        
        [Required]
        public string UserID { get; set; } = string.Empty;
        
        [ForeignKey("UserID")]
        public User? User { get; set; }
        
        [Required]
        public int BookingID { get; set; }
        
        [ForeignKey("BookingID")]
        public Booking? Booking { get; set; }
        
        [Required]
        public int PointsUsed { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; }
        
        [Required]
        public DateTime RedemptionDate { get; set; } = DateTime.Now;
    }
} 