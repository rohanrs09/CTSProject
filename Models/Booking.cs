using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartHotelBookingSystem.Models
{
    public class Booking
    {
        [Key]
        public int BookingID { get; set; }
        
        [Required]
        public string UserID { get; set; } = string.Empty;
        
        [ForeignKey("UserID")]
        public User? User { get; set; }
        
        [Required]
        public int RoomID { get; set; }
        
        [ForeignKey("RoomID")]
        public Room? Room { get; set; }
        
        [Required]
        public DateTime CheckInDate { get; set; }
        
        [Required]
        public DateTime CheckOutDate { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = string.Empty;
        
        public int? PaymentID { get; set; }
        
        [ForeignKey("PaymentID")]
        public Payment? Payment { get; set; }
        
        public ICollection<Redemption>? Redemptions { get; set; }
    }
} 