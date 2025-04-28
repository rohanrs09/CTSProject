using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartHotelBookingSystem.Models
{
    public class Room
    {
        [Key]
        public int RoomID { get; set; }
        
        [Required]
        public int HotelID { get; set; }
        
        [ForeignKey("HotelID")]
        public Hotel? Hotel { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty;
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        [Required]
        public bool Availability { get; set; }
        
        [StringLength(500)]
        public string Features { get; set; } = string.Empty;
        
        public ICollection<Booking>? Bookings { get; set; }
    }
} 