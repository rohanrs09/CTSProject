using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartHotelBookingSystem.Models
{
    public class Hotel
    {
        [Key]
        public int HotelID { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string Location { get; set; } = string.Empty;
        
        [Required]
        public string ManagerID { get; set; } = string.Empty;
        
        [ForeignKey("ManagerID")]
        public User? Manager { get; set; }
        
        [StringLength(500)]
        public string Amenities { get; set; } = string.Empty;
        
        public double Rating { get; set; }
        
        public ICollection<Room>? Rooms { get; set; }
        public ICollection<Review>? Reviews { get; set; }
    }
} 