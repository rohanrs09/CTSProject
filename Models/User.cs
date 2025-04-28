using Microsoft.AspNetCore.Identity;

namespace SmartHotelBookingSystem.Models
{
    public class User : IdentityUser
    {
        public string Name { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
} 

