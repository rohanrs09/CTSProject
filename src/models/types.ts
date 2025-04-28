// User models
export interface User {
  userID: number;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  phone?: string;
  profileImage?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Hotel models
export interface Hotel {
  hotelID: number;
  name: string;
  location: string;
  description: string;
  amenities: string;
  rating: number;
  priceRange: string;
  contactInfo: string;
  image?: string;
}

// Room models
export interface Room {
  roomID: number;
  hotelID: number;
  type: string;
  price: number;
  capacity: number;
  features: string;
  availability: boolean;
  image?: string;
}

// Booking models
export interface Booking {
  bookingID: number;
  userID: number;
  roomID: number;
  checkInDate: string;
  checkOutDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  createdAt: string;
}

export interface BookingRequest {
  roomID: number;
  checkInDate: string;
  checkOutDate: string;
  paymentMethod: string;
}

// Payment models
export interface Payment {
  paymentID: number;
  bookingID: number;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  transactionDate: string;
}

// Review models
export interface Review {
  reviewID: number;
  userID: number;
  hotelID: number;
  rating: number;
  comment: string;
  timestamp: string;
  user?: {
    name: string;
    profileImage?: string;
  };
}

export interface ReviewRequest {
  hotelID: number;
  rating: number;
  comment: string;
}

// Loyalty models
export interface LoyaltyAccount {
  loyaltyID: number;
  userID: number;
  points: number;
  tier: 'standard' | 'silver' | 'gold' | 'platinum';
  joinDate: string;
}

export interface LoyaltyRedemption {
  redemptionID: number;
  loyaltyID: number;
  points: number;
  reward: string;
  date: string;
}

export interface SearchParams {
  location?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
  priceMin?: number;
  priceMax?: number;
  amenities?: string[];
  rating?: number;
} 