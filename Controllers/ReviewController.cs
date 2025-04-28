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
    public class ReviewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Review
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Hotel)
                .ToListAsync();
        }

        // GET: api/Review/Hotel/5
        [HttpGet("Hotel/{hotelId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetHotelReviews(int hotelId)
        {
            return await _context.Reviews
                .Where(r => r.HotelID == hotelId)
                .Include(r => r.User)
                .ToListAsync();
        }

        // GET: api/Review/User
        [HttpGet("User")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Review>>> GetUserReviews()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            return await _context.Reviews
                .Where(r => r.UserID == userId)
                .Include(r => r.Hotel)
                .ToListAsync();
        }

        // POST: api/Review
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Review>> CreateReview(ReviewRequest request)
        {
            // Verify the hotel exists
            var hotel = await _context.Hotels.FindAsync(request.HotelID);
            if (hotel == null)
            {
                return BadRequest("Hotel does not exist");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Verify user has stayed at the hotel
            var hasStayed = await _context.Bookings
                .Include(b => b.Room)
                .AnyAsync(b => b.UserID == userId && 
                          b.Room.HotelID == request.HotelID && 
                          b.CheckOutDate < DateTime.Now &&
                          b.Status == "Confirmed");

            if (!hasStayed)
            {
                return BadRequest("You can only review hotels where you have completed a stay");
            }

            // Check if user has already reviewed this hotel
            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.UserID == userId && r.HotelID == request.HotelID);

            if (existingReview != null)
            {
                // Update existing review instead of creating a new one
                existingReview.Rating = request.Rating;
                existingReview.Comment = request.Comment;
                existingReview.Timestamp = DateTime.Now;
                
                await _context.SaveChangesAsync();
                
                return Ok(existingReview);
            }

            // Create new review
            var review = new Review
            {
                UserID = userId,
                HotelID = request.HotelID,
                Rating = request.Rating,
                Comment = request.Comment,
                Timestamp = DateTime.Now
            };

            _context.Reviews.Add(review);
            
            // Update hotel rating
            await UpdateHotelRating(request.HotelID);
            
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHotelReviews", new { hotelId = review.HotelID }, review);
        }

        // PUT: api/Review/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateReview(int id, ReviewRequest request)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            // Only allow users to update their own reviews unless they are Admin
            if (review.UserID != userId && userRole != "Admin")
            {
                return Forbid();
            }

            review.Rating = request.Rating;
            review.Comment = request.Comment;
            review.Timestamp = DateTime.Now;

            await _context.SaveChangesAsync();
            
            // Update hotel rating
            await UpdateHotelRating(review.HotelID);

            return NoContent();
        }

        // DELETE: api/Review/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            // Only allow users to delete their own reviews unless they are Admin
            if (review.UserID != userId && userRole != "Admin")
            {
                return Forbid();
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            
            // Update hotel rating
            await UpdateHotelRating(review.HotelID);

            return NoContent();
        }

        private async Task UpdateHotelRating(int hotelId)
        {
            var hotel = await _context.Hotels.FindAsync(hotelId);
            if (hotel != null)
            {
                var ratings = await _context.Reviews
                    .Where(r => r.HotelID == hotelId)
                    .Select(r => r.Rating)
                    .ToListAsync();

                if (ratings.Any())
                {
                    hotel.Rating = ratings.Average();
                }
                else
                {
                    hotel.Rating = 0;
                }

                await _context.SaveChangesAsync();
            }
        }
    }

    public class ReviewRequest
    {
        public int HotelID { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
    }
} 