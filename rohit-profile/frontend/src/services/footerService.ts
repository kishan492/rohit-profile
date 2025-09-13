import { apiRequest } from '@/config/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface FooterData {
  _id?: string;
  companyName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  social: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
    github: string;
  };
  quickLinks: Array<{ name: string; url: string }>;
  services: Array<{ name: string; url: string }>;
  copyright: string;
  isVisible: boolean;
}

export const footerService = {
  getFooter: async (): Promise<FooterData> => {
    const response = await fetch(`${API_BASE}/api/footer`);
    if (!response.ok) throw new Error('Failed to fetch footer data');
    return response.json();
  },

  updateFooter: async (data: Partial<FooterData>): Promise<FooterData> => {
    return apiRequest(`${API_BASE}/api/footer`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  toggleVisibility: async (): Promise<{ message: string; footerSection: FooterData }> => {
    return apiRequest(`${API_BASE}/api/footer/visibility`, {
      method: 'PATCH',
    });
  },

  resetFooter: async (): Promise<{ message: string; footerSection: FooterData }> => {
    return apiRequest(`${API_BASE}/api/footer/reset`, {
      method: 'POST',
    });
  },
};