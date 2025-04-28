import axios, { AxiosRequestConfig } from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  Hotel, 
  Room, 
  Booking, 
  BookingRequest, 
  Review, 
  ReviewRequest, 
  LoyaltyAccount, 
  Redemption, 
  RedemptionRequest 
} from '../models/types';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the token to every request
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (loginData: LoginRequest) => api.post<AuthResponse>('/auth/login', loginData),
  register: (registerData: RegisterRequest) => api.post('/auth/register', registerData),
};

// Hotel API
export const hotelAPI = {
  getHotels: () => api.get<Hotel[]>('/hotel'),
  getHotel: (id: number) => api.get<Hotel>(`/hotel/${id}`),
  createHotel: (hotel: Hotel) => api.post<Hotel>('/hotel', hotel),
  updateHotel: (id: number, hotel: Hotel) => api.put(`/hotel/${id}`, hotel),
  deleteHotel: (id: number) => api.delete(`/hotel/${id}`),
  searchHotels: (location?: string, amenities?: string) => {
    let url = '/hotel/search';
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (amenities) params.append('amenities', amenities);
    return api.get<Hotel[]>(`${url}?${params.toString()}`);
  }
};

// Room API
export const roomAPI = {
  getRooms: () => api.get<Room[]>('/room'),
  getRoom: (id: number) => api.get<Room>(`/room/${id}`),
  getRoomsByHotel: (hotelId: number) => api.get<Room[]>(`/room/hotel/${hotelId}`),
  createRoom: (room: Room) => api.post<Room>('/room', room),
  updateRoom: (id: number, room: Room) => api.put(`/room/${id}`, room),
  deleteRoom: (id: number) => api.delete(`/room/${id}`),
  getAvailableRooms: (checkIn: string, checkOut: string, hotelId?: number) => {
    let url = '/room/available';
    const params = new URLSearchParams();
    params.append('checkIn', checkIn);
    params.append('checkOut', checkOut);
    if (hotelId) params.append('hotelId', hotelId.toString());
    return api.get<Room[]>(`${url}?${params.toString()}`);
  }
};

// Booking API
export const bookingAPI = {
  getAllBookings: () => api.get<Booking[]>('/booking'),
  getUserBookings: () => api.get<Booking[]>('/booking/user'),
  getHotelBookings: (hotelId: number) => api.get<Booking[]>(`/booking/hotel/${hotelId}`),
  getBooking: (id: number) => api.get<Booking>(`/booking/${id}`),
  createBooking: (booking: BookingRequest) => api.post<Booking>('/booking', booking),
  updateBookingStatus: (id: number, status: string) => api.put(`/booking/${id}/status`, JSON.stringify(status)),
  cancelBooking: (id: number) => api.delete(`/booking/${id}`)
};

// Review API
export const reviewAPI = {
  getReviews: () => api.get<Review[]>('/review'),
  getHotelReviews: (hotelId: number) => api.get<Review[]>(`/review/hotel/${hotelId}`),
  getUserReviews: () => api.get<Review[]>('/review/user'),
  createReview: (review: ReviewRequest) => api.post<Review>('/review', review),
  updateReview: (id: number, review: ReviewRequest) => api.put(`/review/${id}`, review),
  deleteReview: (id: number) => api.delete(`/review/${id}`)
};

// Loyalty API
export const loyaltyAPI = {
  getLoyaltyAccount: () => api.get<LoyaltyAccount>('/loyalty/account'),
  getRedemptions: () => api.get<Redemption[]>('/loyalty/redemptions'),
  redeemPoints: (redemption: RedemptionRequest) => api.post<Redemption>('/loyalty/redeem', redemption)
};

export default api; 