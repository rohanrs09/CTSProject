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
    public class LoyaltyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LoyaltyController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Loyalty/Account
        [HttpGet("Account")]
        public async Task<ActionResult<LoyaltyAccount>> GetLoyaltyAccount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var loyaltyAccount = await _context.LoyaltyAccounts
                .FirstOrDefaultAsync(l => l.UserID == userId);

            if (loyaltyAccount == null)
            {
                // Create a new account with zero points if one doesn't exist
                loyaltyAccount = new LoyaltyAccount
                {
                    UserID = userId,
                    PointsBalance = 0,
                    LastUpdated = DateTime.Now
                };
                
                _context.LoyaltyAccounts.Add(loyaltyAccount);
                await _context.SaveChangesAsync();
            }

            return loyaltyAccount;
        }

        // GET: api/Loyalty/Redemptions
        [HttpGet("Redemptions")]
        public async Task<ActionResult<IEnumerable<Redemption>>> GetRedemptions()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var redemptions = await _context.Redemptions
                .Where(r => r.UserID == userId)
                .Include(r => r.Booking)
                .ToListAsync();

            return redemptions;
        }

        // POST: api/Loyalty/Redeem
        [HttpPost("Redeem")]
        public async Task<ActionResult<Redemption>> RedeemPoints(RedemptionRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Check if the booking exists and belongs to the user
            var booking = await _context.Bookings
                .Include(b => b.Room)
                .FirstOrDefaultAsync(b => b.BookingID == request.BookingID && b.UserID == userId);

            if (booking == null)
            {
                return BadRequest("Booking not found or does not belong to you");
            }

            // Check if a redemption already exists for this booking
            var existingRedemption = await _context.Redemptions
                .AnyAsync(r => r.BookingID == request.BookingID);

            if (existingRedemption)
            {
                return BadRequest("Points have already been redeemed for this booking");
            }

            // Get the user's loyalty account
            var loyaltyAccount = await _context.LoyaltyAccounts
                .FirstOrDefaultAsync(l => l.UserID == userId);

            if (loyaltyAccount == null || loyaltyAccount.PointsBalance < request.PointsToRedeem)
            {
                return BadRequest("Insufficient loyalty points");
            }

            // Calculate discount amount (1 point = $0.10)
            decimal discountAmount = request.PointsToRedeem * 0.10m;

            // Create the redemption
            var redemption = new Redemption
            {
                UserID = userId,
                BookingID = request.BookingID,
                PointsUsed = request.PointsToRedeem,
                DiscountAmount = discountAmount,
                RedemptionDate = DateTime.Now
            };

            // Update loyalty account
            loyaltyAccount.PointsBalance -= request.PointsToRedeem;
            loyaltyAccount.LastUpdated = DateTime.Now;

            // Update booking payment if it exists
            if (booking.Payment != null)
            {
                var payment = await _context.Payments.FindAsync(booking.PaymentID);
                if (payment != null)
                {
                    // Apply discount to payment amount
                    payment.Amount -= discountAmount;
                    if (payment.Amount < 0)
                    {
                        payment.Amount = 0;
                    }
                }
            }

            _context.Redemptions.Add(redemption);
            await _context.SaveChangesAsync();

            return redemption;
        }
    }

    public class RedemptionRequest
    {
        public int BookingID { get; set; }
        public int PointsToRedeem { get; set; }
    }
} 