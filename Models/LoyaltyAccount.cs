using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartHotelBookingSystem.Models
{
    public class LoyaltyAccount
    {
        [Key]
        public int LoyaltyID { get; set; }
        
        [Required]
        public string UserID { get; set; } = string.Empty;
        
        [ForeignKey("UserID")]
        public User? User { get; set; }
        
        [Required]
        public int PointsBalance { get; set; } = 0;
        
        [Required]
        public DateTime LastUpdated { get; set; } = DateTime.Now;
        
        public ICollection<Redemption>? Redemptions { get; set; }
    }
} 