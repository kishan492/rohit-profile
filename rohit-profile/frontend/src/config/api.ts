// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Batch API requests
export const batchRequests = async (requests: Array<{ url: string; options?: RequestInit }>) => {
  return Promise.all(requests.map(req => apiRequest(req.url, req.options)));
};

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

// API Cache
const apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Debounce helper
const debounceMap = new Map<string, NodeJS.Timeout>();

export const debounce = (key: string, fn: Function, delay: number = 500) => {
  if (debounceMap.has(key)) {
    clearTimeout(debounceMap.get(key)!);
  }
  const timeout = setTimeout(() => {
    fn();
    debounceMap.delete(key);
  }, delay);
  debounceMap.set(key, timeout);
};

// Cache helper functions
const getCacheKey = (url: string, options: RequestInit = {}) => {
  return `${url}_${JSON.stringify(options)}`;
};

const getFromCache = (key: string) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  apiCache.delete(key);
  return null;
};

const setCache = (key: string, data: any, ttl: number = CACHE_TTL) => {
  apiCache.set(key, { data, timestamp: Date.now(), ttl });
};

// Optimized API Helper function with caching
export const apiRequest = async (url: string, options: RequestInit = {}, useCache: boolean = true) => {
  const cacheKey = getCacheKey(url, options);
  
  // Return cached data for GET requests
  if (useCache && (!options.method || options.method === 'GET')) {
    const cached = getFromCache(cacheKey);
    if (cached) return cached;
  }
  
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
  
  const data = await response.json();
  
  // Cache GET requests
  if (useCache && (!options.method || options.method === 'GET')) {
    setCache(cacheKey, data);
  }
  
  return data;
};

// Clear cache for specific patterns
export const clearCache = (pattern?: string) => {
  if (pattern) {
    for (const key of apiCache.keys()) {
      if (key.includes(pattern)) {
        apiCache.delete(key);
      }
    }
  } else {
    apiCache.clear();
  }
};