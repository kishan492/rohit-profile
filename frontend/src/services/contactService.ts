import { apiRequest } from '@/config/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ContactData {
  _id?: string;
  sectionTitle: string;
  sectionDescription: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  weekdays: string;
  saturday: string;
  sunday: string;
  isVisible: boolean;
}

export const contactService = {
  getContact: async (): Promise<ContactData> => {
    const response = await fetch(`${API_BASE}/api/contact`);
    if (!response.ok) throw new Error('Failed to fetch contact data');
    return response.json();
  },

  updateContact: async (data: Partial<ContactData>): Promise<ContactData> => {
    return apiRequest(`${API_BASE}/api/contact`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  toggleVisibility: async (): Promise<{ message: string; contactSection: ContactData }> => {
    return apiRequest(`${API_BASE}/api/contact/visibility`, {
      method: 'PATCH',
    });
  },
};