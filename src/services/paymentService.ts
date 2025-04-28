import { Payment } from '../types';

const API_URL = '/api';

export const paymentService = {
  async processPayment(paymentData: {
    bookingId: string;
    amount: number;
    paymentMethod: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
  }): Promise<Payment> {
    const response = await fetch(`${API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(paymentData)
    });
    if (!response.ok) {
      throw new Error('Failed to process payment');
    }
    return response.json();
  },

  async getPayments(): Promise<Payment[]> {
    const response = await fetch(`${API_URL}/payments`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }
    return response.json();
  },

  async getPaymentById(id: string): Promise<Payment> {
    const response = await fetch(`${API_URL}/payments/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch payment');
    }
    return response.json();
  },

  async refundPayment(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/payments/${id}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to process refund');
    }
  }
}; 