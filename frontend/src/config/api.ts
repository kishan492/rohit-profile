// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    VERIFY: `${API_BASE_URL}/api/auth/verify`,
  },
  SECTIONS: {
    GET_ALL: `${API_BASE_URL}/api/sections`,
    GET_BY_TYPE: (type: string) => `${API_BASE_URL}/api/sections/${type}`,
    UPDATE: (type: string) => `${API_BASE_URL}/api/sections/${type}`,
    TOGGLE_VISIBILITY: (type: string) => `${API_BASE_URL}/api/sections/${type}/visibility`,
  },
  TESTIMONIALS: {
    GET_ALL: `${API_BASE_URL}/api/testimonials`,
    SUBMIT_REVIEW: `${API_BASE_URL}/api/testimonials/review`,
    GET_ADMIN: `${API_BASE_URL}/api/testimonials/admin`,
    UPDATE_STATUS: (id: string) => `${API_BASE_URL}/api/testimonials/${id}/status`,
    DELETE: (id: string) => `${API_BASE_URL}/api/testimonials/${id}`,
  },
  UPLOAD: {
    IMAGE: `${API_BASE_URL}/api/upload/image`,
    MULTIPLE: `${API_BASE_URL}/api/upload/multiple`,
  }
};

// API Helper function
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
};