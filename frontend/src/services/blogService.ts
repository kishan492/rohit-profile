import { apiRequest } from '@/config/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  publishedAt: string;
  tags: string[];
  slug: string;
}

export interface BlogData {
  _id?: string;
  sectionTitle: string;
  sectionDescription: string;
  posts: BlogPost[];
  isVisible: boolean;
}

export const blogService = {
  getBlog: async (): Promise<BlogData> => {
    const response = await fetch(`${API_BASE}/api/blog`);
    if (!response.ok) throw new Error('Failed to fetch blog data');
    return response.json();
  },

  updateBlog: async (data: Partial<BlogData>): Promise<BlogData> => {
    return apiRequest(`${API_BASE}/api/blog`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};