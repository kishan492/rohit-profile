import { useEffect } from 'react';
import { clearCache } from '@/config/api';

// Hook for API optimization
export const useApiOptimization = () => {
  useEffect(() => {
    // Clear cache on page visibility change (when user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Clear cache older than 2 minutes when user returns
        setTimeout(() => clearCache(), 100);
      }
    };

    // Clear cache on network status change
    const handleOnline = () => {
      clearCache(); // Refresh data when connection restored
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, []);
};

// Hook for batch loading multiple sections
export const useBatchLoader = (sections: string[]) => {
  const loadSections = async () => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const requests = sections.map(section => ({
      url: `${API_BASE}/api/${section}`,
    }));
    
    try {
      const { batchRequests } = await import('@/config/api');
      return await batchRequests(requests);
    } catch (error) {
      console.error('Batch loading failed:', error);
      return [];
    }
  };

  return { loadSections };
};