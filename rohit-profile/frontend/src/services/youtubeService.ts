import { apiRequest } from '@/config/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Video {
  title: string;
  description: string;
  videoId: string;
  thumbnail?: string;
  views: string;
  publishedAt: string;
}

export interface YoutubeData {
  _id?: string;
  sectionTitle: string;
  sectionDescription: string;
  channelName: string;
  channelUrl: string;
  subscriberCount: string;
  totalViews: string;
  videos: Video[];
  isVisible: boolean;
}

export const youtubeService = {
  getYoutube: async (): Promise<YoutubeData> => {
    const response = await fetch(`${API_BASE}/api/youtube`);
    if (!response.ok) throw new Error('Failed to fetch youtube data');
    return response.json();
  },

  updateYoutube: async (data: Partial<YoutubeData>): Promise<YoutubeData> => {
    return apiRequest(`${API_BASE}/api/youtube`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  toggleVisibility: async (): Promise<{ message: string; youtubeSection: YoutubeData }> => {
    return apiRequest(`${API_BASE}/api/youtube/visibility`, {
      method: 'PATCH',
    });
  },
};