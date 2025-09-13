import { apiRequest } from '@/config/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Achievement {
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface AchievementsData {
  _id?: string;
  sectionTitle: string;
  sectionDescription: string;
  achievements: Achievement[];
  ctaTitle: string;
  ctaDescription: string;
  isVisible?: boolean;
}

export const achievementsService = {
  getAchievements: async (): Promise<AchievementsData> => {
    const response = await fetch(`${API_BASE}/api/achievements`);
    if (!response.ok) throw new Error('Failed to fetch achievements data');
    return response.json();
  },

  updateAchievements: async (data: Partial<AchievementsData>): Promise<AchievementsData> => {
    return apiRequest(`${API_BASE}/api/achievements`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  toggleVisibility: async (): Promise<{ message: string; achievementsSection: AchievementsData }> => {
    return apiRequest(`${API_BASE}/api/achievements/visibility`, {
      method: 'PATCH',
    });
  },

  // Reset to defaults
  resetAchievements: async (): Promise<{ message: string; achievementsSection: AchievementsData }> => {
    return apiRequest(`${API_BASE}/api/achievements/reset`, {
      method: 'POST',
    });
  },
};