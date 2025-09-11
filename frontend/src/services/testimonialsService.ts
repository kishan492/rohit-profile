import { apiRequest } from '@/config/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
  status?: 'pending' | 'approved' | 'rejected';
  isCustomerReview?: boolean;
  priority?: number;
  createdAt?: string;
}

export interface TestimonialsData {
  _id?: string;
  sectionTitle: string;
  sectionDescription: string;
  testimonials: Testimonial[];
  isVisible: boolean;
}

export const testimonialsService = {
  getTestimonials: async (): Promise<TestimonialsData> => {
    const response = await fetch(`${API_BASE}/api/testimonials-section`);
    if (!response.ok) throw new Error('Failed to fetch testimonials data');
    return response.json();
  },

  updateTestimonials: async (data: Partial<TestimonialsData>): Promise<TestimonialsData> => {
    return apiRequest(`${API_BASE}/api/testimonials-section`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  toggleVisibility: async (): Promise<{ message: string; testimonialsSection: TestimonialsData }> => {
    return apiRequest(`${API_BASE}/api/testimonials-section/visibility`, {
      method: 'PATCH',
    });
  },

  // Admin functions for managing individual testimonials
  getAllTestimonials: async (): Promise<Testimonial[]> => {
    return apiRequest(`${API_BASE}/api/testimonials/admin`);
  },

  updateTestimonialStatus: async (id: string, status: 'approved' | 'rejected'): Promise<Testimonial> => {
    return apiRequest(`${API_BASE}/api/testimonials/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  deleteTestimonial: async (id: string): Promise<{ message: string }> => {
    return apiRequest(`${API_BASE}/api/testimonials/${id}`, {
      method: 'DELETE',
    });
  },
};