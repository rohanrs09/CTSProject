import { Booking } from '../types';

const API_URL = '/api';

export const bookingService = {
  async createBooking(bookingData: {
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    specialRequests?: string;
  }): Promise<Booking> {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(bookingData)
    });
    if (!response.ok) {
      throw new Error('Failed to create booking');
    }
    return response.json();
  },

  async getBookings(): Promise<Booking[]> {
    const response = await fetch(`${API_URL}/bookings`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return response.json();
  },

  async getBookingById(id: string): Promise<Booking> {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch booking');
    }
    return response.json();
  },

  async cancelBooking(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/bookings/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to cancel booking');
    }
  }
}; 