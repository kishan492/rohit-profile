import { apiRequest, debounce, clearCache } from '@/config/api';

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
    return apiRequest(`${API_BASE}/api/contact`);
  },

  updateContact: async (data: Partial<ContactData>): Promise<ContactData> => {
    const result = await apiRequest(`${API_BASE}/api/contact`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    clearCache('/api/contact');
    return result;
  },

  updateContactDebounced: (data: Partial<ContactData>, callback?: (result: ContactData) => void) => {
    debounce('contact-update', async () => {
      try {
        const result = await contactService.updateContact(data);
        callback?.(result);
      } catch (error) {
        console.error('Failed to update contact data:', error);
      }
    }, 1000);
  },

  toggleVisibility: async (): Promise<{ message: string; contactSection: ContactData }> => {
    const result = await apiRequest(`${API_BASE}/api/contact/visibility`, {
      method: 'PATCH',
    });
    clearCache('/api/contact');
    return result;
  },
};