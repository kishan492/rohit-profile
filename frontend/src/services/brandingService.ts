import { apiRequest } from '@/config/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface BrandingData {
  _id?: string;
  siteName: string;
  logoText: string;
  logoImage?: string;
  favicon?: string;
  browserTitle: string;
  metaDescription: string;
}

export const brandingService = {
  // Get site branding data
  getBranding: async (): Promise<BrandingData> => {
    const response = await fetch(`${API_BASE}/api/branding`);
    if (!response.ok) throw new Error('Failed to fetch branding data');
    return response.json();
  },

  // Update site branding data
  updateBranding: async (data: Partial<BrandingData>): Promise<BrandingData> => {
    return apiRequest(`${API_BASE}/api/branding`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};