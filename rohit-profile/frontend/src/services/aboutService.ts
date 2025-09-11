import { apiRequest } from '@/config/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface AboutData {
  _id?: string;
  sectionTitle: string;
  sectionSubtitle: string;
  mainTitle: string;
  description1: string;
  description2: string;
  aboutImage?: string;
  location: string;
  founded: string;
  teamSize: string;
  awards: string;
  mission: string;
  values: string;
  isVisible: boolean;
}

export const aboutService = {
  getAbout: async (): Promise<AboutData> => {
    const response = await fetch(`${API_BASE}/api/about`);
    if (!response.ok) throw new Error('Failed to fetch about data');
    return response.json();
  },

  updateAbout: async (data: Partial<AboutData>): Promise<AboutData> => {
    return apiRequest(`${API_BASE}/api/about`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  toggleVisibility: async (): Promise<{ message: string; aboutSection: AboutData }> => {
    return apiRequest(`${API_BASE}/api/about/visibility`, {
      method: 'PATCH',
    });
  },
};