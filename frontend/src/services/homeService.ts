import { apiRequest } from '@/config/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface HomeData {
  _id?: string;
  name: string;
  title: string;
  headline: string;
  subtitle: string;
  stats: {
    projects: string;
    views: string;
    clients: string;
    experience: string;
  };

  isVisible: boolean;
}

export const homeService = {
  // Get home section data
  getHome: async (): Promise<HomeData> => {
    const response = await fetch(`${API_BASE}/api/home`);
    if (!response.ok) throw new Error('Failed to fetch home data');
    return response.json();
  },

  // Update home section data
  updateHome: async (data: Partial<HomeData>): Promise<HomeData> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/api/home`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    return response.json();
  },

  // Toggle home section visibility
  toggleVisibility: async (): Promise<{ message: string; homeSection: HomeData }> => {
    return apiRequest(`${API_BASE}/api/home/visibility`, {
      method: 'PATCH',
    });
  },

  // Reset to defaults
  resetHome: async (): Promise<{ message: string; homeSection: HomeData }> => {
    return apiRequest(`${API_BASE}/api/home/reset`, {
      method: 'POST',
    });
  },
};