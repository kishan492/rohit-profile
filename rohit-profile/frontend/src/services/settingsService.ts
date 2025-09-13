import { apiRequest } from '@/config/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface SectionVisibility {
  hero: boolean;
  about: boolean;
  services: boolean;
  testimonials: boolean;
  achievements: boolean;
  youtube: boolean;
  team: boolean;
  blog: boolean;
  contact: boolean;
}

export interface SiteInfo {
  siteTitle: string;
  siteTagline: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
}

export interface SEOSettings {
  metaKeywords: string;
  metaDescription: string;
  googleAnalyticsId: string;
  googleSearchConsole: string;
}

export interface PerformanceSettings {
  enableAnimations: boolean;
  lazyLoadImages: boolean;
  enableCaching: boolean;
}

export interface MaintenanceSettings {
  enableMaintenanceMode: boolean;
  maintenanceMessage: string;
}

export interface SettingsData {
  _id?: string;
  sectionVisibility: SectionVisibility;
  siteInfo: SiteInfo;
  seoSettings: SEOSettings;
  performanceSettings: PerformanceSettings;
  maintenanceSettings: MaintenanceSettings;
}

export const settingsService = {
  getSettings: async (): Promise<SettingsData> => {
    const response = await fetch(`${API_BASE}/api/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  updateSettings: async (data: Partial<SettingsData>): Promise<SettingsData> => {
    return apiRequest(`${API_BASE}/api/settings`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  resetSettings: async (): Promise<{ message: string; settings: SettingsData }> => {
    return apiRequest(`${API_BASE}/api/settings/reset`, {
      method: 'POST',
    });
  },
};