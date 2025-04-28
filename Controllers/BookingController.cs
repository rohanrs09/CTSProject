using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHotelBookingSystem.Data;
using SmartHotelBookingSystem.Models;
using System.Security.Claims;

namespace SmartHotelBookingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Booking
        [HttpGet]
        [Authorize(Roles = "Admin,HotelManager")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAllBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.Room)
                    .ThenInclude(r => r.Hotel)
                .Include(b => b.User)
                .Include(b => b.Payment)
                .ToListAsync();

            return bookings;
        }

        // GET: api/Booking/User
        [HttpGet("User")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetUserBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var bookings = await _context.Bookings
                .Where(b => b.UserID == userId)
                .Include(b => b.Room)
                    .ThenInclude(r => r.Hotel)
                .Include(b => b.Payment)
                .ToListAsync();

            return bookings;
        }

        // GET: api/Booking/Hotel/5
        [HttpGet("Hotel/{hotelId}")]
        [Authorize(Roles = "Admin,HotelManager")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetHotelBookings(int hotelId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Room)
                .Include(b => b.User)
                .Include(b => b.Payment)
                .Where(b => b.Room.HotelID == hotelId)
                .ToListAsync();

            return bookings;
        }

        // GET: api/Booking/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            var booking = await _context.Bookings
                .Include(b => b.Room)
                    .ThenInclude(r => r.Hotel)
                .Include(b => b.User)
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.BookingID == id);

            if (booking == null)
            {
                return NotFound();
            }

            // Only allow users to view their own bookings unless they are Admin or HotelManager
            if (booking.UserID != userId && userRole != "Admin" && userRole != "HotelManager")
            {
                return Forbid();
            }

            return booking;
        }

        // POST: api/Booking
        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking(BookingRequest request)
        {
            // Verify the room exists and is available
            var room = await _context.Rooms.FindAsync(request.RoomID);
            if (room == null)
            {
                return BadRequest("Room does not exist");
            }

            if (!room.Availability)
            {
                return BadRequest("Room is not available");
            }

            // Check if the room is already booked for the requested dates
            var conflictingBooking = await _context.Bookings
                .Where(b => b.RoomID == request.RoomID &&
                           (request.CheckInDate <= b.CheckOutDate && request.CheckOutDate >= b.CheckInDate) &&
                           (b.Status == "Confirmed" || b.Status == "Pending"))
                .AnyAsync();

            if (conflictingBooking)
            {
                return BadRequest("Room is already booked for the selected dates");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Create the booking
            var booking = new Booking
            {
                UserID = userId,
                RoomID = request.RoomID,
                CheckInDate = request.CheckInDate,
                CheckOutDate = request.CheckOutDate,
                Status = "Pending" // Initial status
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            // If payment details provided, process payment
            if (request.Payment != null)
            {
                var payment = new Payment
                {
                    UserID = userId,
                    BookingID = booking.BookingID,
                    Amount = request.Payment.Amount,
                    Status = "Pending",
                    PaymentMethod = request.Payment.PaymentMethod
                };

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                // Update booking with payment reference
                booking.PaymentID = payment.PaymentID;
                // Simulate payment processing
                payment.Status = "Completed";
                booking.Status = "Confirmed";

                await _context.SaveChangesAsync();
            }

            // Add loyalty points for the booking
            await AddLoyaltyPoints(userId, room.Price);

            return CreatedAtAction("GetBooking", new { id = booking.BookingID }, booking);
        }

        // PUT: api/Booking/5/Status
        [HttpPut("{id}/Status")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] string status)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            // Only allow users to update their own bookings unless they are Admin or HotelManager
            if (booking.UserID != userId && userRole != "Admin" && userRole != "HotelManager")
            {
                return Forbid();
            }

            booking.Status = status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Booking/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            // Only allow users to cancel their own bookings unless they are Admin
            if (booking.UserID != userId && userRole != "Admin")
            {
                return Forbid();
            }

            // Check if cancellation is within allowed time (24 hours before check-in)
            if (booking.CheckInDate <= DateTime.Now.AddHours(24) && userRole != "Admin")
            {
                return BadRequest("Cancellations must be made at least 24 hours before check-in");
            }

            // Update the booking status rather than deleting
            booking.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task AddLoyaltyPoints(string userId, decimal bookingAmount)
        {
            // Add loyalty points based on booking amount (1 point per $10 spent)
            int pointsToAdd = (int)(bookingAmount / 10);
            
            var loyaltyAccount = await _context.LoyaltyAccounts
                .FirstOrDefaultAsync(l => l.UserID == userId);

            if (loyaltyAccount == null)
            {
                // Create a new loyalty account if one doesn't exist
                loyaltyAccount = new LoyaltyAccount
                {
                    UserID = userId,
                    PointsBalance = pointsToAdd,
                    LastUpdated = DateTime.Now
                };
                _context.LoyaltyAccounts.Add(loyaltyAccount);
            }
            else
            {
                // Update existing account
                loyaltyAccount.PointsBalance += pointsToAdd;
                loyaltyAccount.LastUpdated = DateTime.Now;
            }

            await _context.SaveChangesAsync();
        }
    }

    public class BookingRequest
    {
        public int RoomID { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public PaymentRequest? Payment { get; set; }
    }

    public class PaymentRequest
    {
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
    }
} 