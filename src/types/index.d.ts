import { ReactNode } from 'react';

export interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'User' | 'Admin' | 'HotelManager';
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  amenities: string[];
  images: string[];
}

export interface Room {
  id: string;
  hotelId: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  available: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  transactionId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  hotelId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface LoyaltyAccount {
  id: string;
  userId: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  joinDate: string;
}

export interface Redemption {
  id: string;
  userId: string;
  rewardId: string;
  points: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
} 