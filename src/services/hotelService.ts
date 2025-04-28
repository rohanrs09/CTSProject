import { Hotel, Room } from '../types';

const API_URL = '/api';

export const hotelService = {
  async getAllHotels(): Promise<Hotel[]> {
    const response = await fetch(`${API_URL}/hotels`);
    if (!response.ok) {
      throw new Error('Failed to fetch hotels');
    }
    return response.json();
  },

  async getHotelById(id: string): Promise<Hotel> {
    const response = await fetch(`${API_URL}/hotels/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch hotel');
    }
    return response.json();
  },

  async getHotelRooms(hotelId: string): Promise<Room[]> {
    const response = await fetch(`${API_URL}/hotels/${hotelId}/rooms`);
    if (!response.ok) {
      throw new Error('Failed to fetch hotel rooms');
    }
    return response.json();
  },

  async searchHotels(query: string): Promise<Hotel[]> {
    const response = await fetch(`${API_URL}/hotels/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search hotels');
    }
    return response.json();
  },

  async filterHotels(filters: {
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
    rating?: number;
  }): Promise<Hotel[]> {
    const queryParams = new URLSearchParams();
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (filters.amenities) queryParams.append('amenities', filters.amenities.join(','));
    if (filters.rating) queryParams.append('rating', filters.rating.toString());

    const response = await fetch(`${API_URL}/hotels/filter?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to filter hotels');
    }
    return response.json();
  }
}; 