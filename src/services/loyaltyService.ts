import { LoyaltyAccount, Redemption } from '../types';

const API_URL = '/api';

export const loyaltyService = {
  async getLoyaltyAccount(): Promise<LoyaltyAccount> {
    const response = await fetch(`${API_URL}/loyalty/account`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch loyalty account');
    }
    return response.json();
  },

  async getRedemptions(): Promise<Redemption[]> {
    const response = await fetch(`${API_URL}/loyalty/redemptions`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch redemptions');
    }
    return response.json();
  },

  async redeemPoints(rewardId: string): Promise<Redemption> {
    const response = await fetch(`${API_URL}/loyalty/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ rewardId })
    });
    if (!response.ok) {
      throw new Error('Failed to redeem points');
    }
    return response.json();
  },

  async getRewards(): Promise<{
    id: string;
    name: string;
    points: number;
    description: string;
  }[]> {
    const response = await fetch(`${API_URL}/loyalty/rewards`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch rewards');
    }
    return response.json();
  }
}; 