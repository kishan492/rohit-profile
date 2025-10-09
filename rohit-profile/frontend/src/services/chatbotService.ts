import { Message } from '@/contexts/ChatbotContext';
import { apiRequest } from '@/config/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Interface for chat history
export interface ChatHistory {
  userId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Interfaces for chatbot data
export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  businessHours: string;
}

export interface PortfolioInfo {
  name: string;
  title: string;
  tagline: string;
  description: string;
  skills: string[];
  experience: string;
  education: string[];
  certifications: string[];
  services: any[];
  specializations: string[];
  achievements: any[];
  projects: any[];
  teamSize: number;
  workingStyle: string;
  availability: string;
  responseTime: string;
  frontendTech: string[];
  backendTech: string[];
  tools: string[];
}

// Chatbot service for backend integration
export const chatbotService = {
  // Get chat history for a user
  getChatHistory: async (userId: string): Promise<Message[]> => {
    try {
      const response = await fetch(`${API_BASE}/api/chatbot/history/${userId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return []; // No history found, return empty array
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      return [];
    }
  },

  // Save chat history for a user
  saveChatHistory: async (userId: string, messages: Message[]): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/api/chatbot/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, messages }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save chat history:', error);
      return false;
    }
  },

  // Clear chat history for a user
  clearChatHistory: async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/api/chatbot/history/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      return false;
    }
  },

  // Get contact information
  getContactInfo: async (): Promise<ContactInfo | null> => {
    try {
      const response = await fetch(`${API_BASE}/api/chatbot/contact-info`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch contact info:', error);
      return null;
    }
  },

  // Get portfolio information
  getPortfolioInfo: async (): Promise<PortfolioInfo | null> => {
    try {
      const response = await fetch(`${API_BASE}/api/chatbot/portfolio-info`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch portfolio info:', error);
      return null;
    }
  },

  // Generate a unique user ID if not already stored
  getUserId: (): string => {
    let userId = localStorage.getItem('chatbot_user_id');
    if (!userId) {
      userId = `user_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
      localStorage.setItem('chatbot_user_id', userId);
    }
    return userId;
  }
};

export default chatbotService;