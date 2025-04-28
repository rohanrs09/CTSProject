using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SmartHotelBookingSystem.Models
{
    public class Review
    {
        [Key]
        public int ReviewID { get; set; }
        
        [Required]
        public string UserID { get; set; } = string.Empty;
        
        [ForeignKey("UserID")]
        [DeleteBehavior(DeleteBehavior.NoAction)]
        public User? User { get; set; }
        
        [Required]
        public int HotelID { get; set; }
        
        [ForeignKey("HotelID")]
        [DeleteBehavior(DeleteBehavior.NoAction)]
        public Hotel? Hotel { get; set; }
        
        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }
        
        [StringLength(1000)]
        public string Comment { get; set; } = string.Empty;
        
        [Required]
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
} 