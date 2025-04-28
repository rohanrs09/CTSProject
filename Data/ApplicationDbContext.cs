using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmartHotelBookingSystem.Models;

namespace SmartHotelBookingSystem.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<LoyaltyAccount> LoyaltyAccounts { get; set; }
        public DbSet<Redemption> Redemptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure one-to-many relationship between Hotel and Room
            modelBuilder.Entity<Room>()
                .HasOne(r => r.Hotel)
                .WithMany(h => h.Rooms)
                .HasForeignKey(r => r.HotelID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure one-to-many relationship between Hotel and Review
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Hotel)
                .WithMany(h => h.Reviews)
                .HasForeignKey(r => r.HotelID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure one-to-many relationship between User and Booking
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure one-to-many relationship between Room and Booking
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Room)
                .WithMany(r => r.Bookings)
                .HasForeignKey(b => b.RoomID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure one-to-one relationship between Booking and Payment
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Payment)
                .WithOne(p => p.Booking)
                .HasForeignKey<Booking>(b => b.PaymentID)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure one-to-many relationship between User and LoyaltyAccount
            modelBuilder.Entity<LoyaltyAccount>()
                .HasOne(l => l.User)
                .WithMany()
                .HasForeignKey(l => l.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure one-to-many relationship between User and Redemption
            modelBuilder.Entity<Redemption>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure one-to-many relationship between Booking and Redemption
            modelBuilder.Entity<Redemption>()
                .HasOne(r => r.Booking)
                .WithMany(b => b.Redemptions)
                .HasForeignKey(r => r.BookingID)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
} 