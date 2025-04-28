import { Review } from '../types';

const API_URL = '/api';

export const reviewService = {
  async createReview(reviewData: {
    hotelId: string;
    rating: number;
    comment: string;
  }): Promise<Review> {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) {
      throw new Error('Failed to create review');
    }
    return response.json();
  },

  async getReviews(hotelId: string): Promise<Review[]> {
    const response = await fetch(`${API_URL}/reviews?hotelId=${hotelId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return response.json();
  },

  async updateReview(id: string, reviewData: {
    rating: number;
    comment: string;
  }): Promise<Review> {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) {
      throw new Error('Failed to update review');
    }
    return response.json();
  },

  async deleteReview(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete review');
    }
  }
}; 