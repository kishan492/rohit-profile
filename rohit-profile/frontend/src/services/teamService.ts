import { apiRequest } from '@/config/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface TeamMember {
  name: string;
  role: string;
  location: string;
  bio: string;
  initials: string;
  skills: string[];
  avatar?: string;
  social: {
    linkedin: string;
    twitter: string;
    github: string;
    email: string;
  };
}

export interface TeamData {
  _id?: string;
  sectionTitle: string;
  sectionDescription: string;
  members: TeamMember[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  isVisible?: boolean;
}

export const teamService = {
  getTeam: async (): Promise<TeamData> => {
    const response = await fetch(`${API_BASE}/api/team`);
    if (!response.ok) throw new Error('Failed to fetch team data');
    return response.json();
  },

  updateTeam: async (data: Partial<TeamData>): Promise<TeamData> => {
    return apiRequest(`${API_BASE}/api/team`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  toggleVisibility: async (): Promise<{ message: string; teamSection: TeamData }> => {
    return apiRequest(`${API_BASE}/api/team/visibility`, {
      method: 'PATCH',
    });
  },

  // Reset to defaults
  resetTeam: async (): Promise<{ message: string; teamSection: TeamData }> => {
    return apiRequest(`${API_BASE}/api/team/reset`, {
      method: 'POST',
    });
  },
};