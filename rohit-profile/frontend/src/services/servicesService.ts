import { apiRequest } from '@/config/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Service {
  title: string;
  description: string;
  icon: string;
  features: string[];
  color: string;
}

export interface ServicesData {
  _id?: string;
  sectionTitle: string;
  sectionDescription: string;
  services: Service[];
  partnersTitle: string;
  partnersList: string;
  isVisible: boolean;
}

export const servicesService = {
  getServices: async (): Promise<ServicesData> => {
    const response = await fetch(`${API_BASE}/api/services`);
    if (!response.ok) throw new Error('Failed to fetch services data');
    return response.json();
  },

  updateServices: async (data: Partial<ServicesData>): Promise<ServicesData> => {
    return apiRequest(`${API_BASE}/api/services`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  toggleVisibility: async (): Promise<{ message: string; servicesSection: ServicesData }> => {
    return apiRequest(`${API_BASE}/api/services/visibility`, {
      method: 'PATCH',
    });
  },
};