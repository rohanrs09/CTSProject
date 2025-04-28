using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHotelBookingSystem.Data;
using SmartHotelBookingSystem.Models;

namespace SmartHotelBookingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RoomController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Room
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
        {
            return await _context.Rooms.Include(r => r.Hotel).ToListAsync();
        }

        // GET: api/Room/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.Hotel)
                .FirstOrDefaultAsync(r => r.RoomID == id);

            if (room == null)
            {
                return NotFound();
            }

            return room;
        }

        // GET: api/Room/Hotel/5
        [HttpGet("Hotel/{hotelId}")]
        public async Task<ActionResult<IEnumerable<Room>>> GetRoomsByHotel(int hotelId)
        {
            return await _context.Rooms
                .Where(r => r.HotelID == hotelId)
                .ToListAsync();
        }

        // POST: api/Room
        [HttpPost]
        [Authorize(Roles = "Admin,HotelManager")]
        public async Task<ActionResult<Room>> CreateRoom(Room room)
        {
            // Verify the hotel exists
            if (!await _context.Hotels.AnyAsync(h => h.HotelID == room.HotelID))
            {
                return BadRequest("Hotel does not exist");
            }

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRoom", new { id = room.RoomID }, room);
        }

        // PUT: api/Room/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,HotelManager")]
        public async Task<IActionResult> UpdateRoom(int id, Room room)
        {
            if (id != room.RoomID)
            {
                return BadRequest();
            }

            _context.Entry(room).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Room/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,HotelManager")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
        // GET: api/Room/Available?checkIn=2023-06-01&checkOut=2023-06-05&hotelId=1
        [HttpGet("Available")]
        public async Task<ActionResult<IEnumerable<Room>>> GetAvailableRooms(DateTime checkIn, DateTime checkOut, int? hotelId)
        {
            var query = _context.Rooms.Where(r => r.Availability);

            if (hotelId.HasValue)
            {
                query = query.Where(r => r.HotelID == hotelId);
            }

            // Filter out rooms that are already booked during the specified date range
            var bookedRoomIds = await _context.Bookings
                .Where(b => (checkIn <= b.CheckOutDate && checkOut >= b.CheckInDate) && 
                           (b.Status == "Confirmed" || b.Status == "Pending"))
                .Select(b => b.RoomID)
                .ToListAsync();

            var availableRooms = await query
                .Where(r => !bookedRoomIds.Contains(r.RoomID))
                .Include(r => r.Hotel)
                .ToListAsync();

            return availableRooms;
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.RoomID == id);
        }
    }
} 