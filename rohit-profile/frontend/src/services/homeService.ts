import { apiRequest, debounce, clearCache } from '@/config/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface HomeData {
  _id?: string;
  name: string;
  title: string;
  headline: string;
  subtitle: string;
  profileImage?: string;
  stats: {
    projects: string;
    views: string;
    clients: string;
    experience: string;
  };
  isVisible: boolean;
}

export const homeService = {
  // Get home section data with caching
  getHome: async (): Promise<HomeData> => {
    return apiRequest(`${API_BASE}/api/home`);
  },

  // Update home section data with debouncing
  updateHome: async (data: Partial<HomeData>): Promise<HomeData> => {
    const result = await apiRequest(`${API_BASE}/api/home`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    // Clear cache after update
    clearCache('/api/home');
    
    return result;
  },

  // Debounced update for real-time editing
  updateHomeDebounced: (data: Partial<HomeData>, callback?: (result: HomeData) => void) => {
    debounce('home-update', async () => {
      try {
        const result = await homeService.updateHome(data);
        callback?.(result);
      } catch (error) {
        console.error('Failed to update home data:', error);
      }
    }, 1000);
  },

  // Toggle home section visibility
  toggleVisibility: async (): Promise<{ message: string; homeSection: HomeData }> => {
    const result = await apiRequest(`${API_BASE}/api/home/visibility`, {
      method: 'PATCH',
    });
    clearCache('/api/home');
    return result;
  },

  // Reset to defaults
  resetHome: async (): Promise<{ message: string; homeSection: HomeData }> => {
    const result = await apiRequest(`${API_BASE}/api/home/reset`, {
      method: 'POST',
    });
    clearCache('/api/home');
    return result;
  },
};