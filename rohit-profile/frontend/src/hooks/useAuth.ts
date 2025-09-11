import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  const checkTokenExpiry = () => {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');
    
    if (!token || !loginTime) {
      logout();
      return false;
    }

    const currentTime = Date.now();
    const loginTimestamp = parseInt(loginTime);
    const expiryTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    
    if (currentTime - loginTimestamp > expiryTime) {
      logout();
      alert('Session expired. Please login again.');
      return false;
    }
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null
    });
  };

  const login = (token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('loginTime', Date.now().toString());
    setAuthState({
      isAuthenticated: true,
      user,
      token
    });
  };

  useEffect(() => {
    // Check authentication on mount
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user && checkTokenExpiry()) {
      setAuthState({
        isAuthenticated: true,
        user: JSON.parse(user),
        token
      });
    }

    // Set up interval to check token expiry every minute
    const interval = setInterval(() => {
      if (authState.isAuthenticated) {
        checkTokenExpiry();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [authState.isAuthenticated]);

  return {
    ...authState,
    login,
    logout,
    checkTokenExpiry
  };
};