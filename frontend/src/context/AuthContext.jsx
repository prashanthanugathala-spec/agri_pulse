import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

const defaultDemoUser = {
  id: 1,
  email: 'ravi@agripulse.io',
  fullName: 'Ravi Kumar',
  role: 'ESTATE_AGRONOMIST',
  farmName: 'Precision Agriculture Estate',
  totalAcreage: 12.5,
  token: 'agripulse_demo_jwt_token',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('agripulse_user');
      return saved ? JSON.parse(saved) : defaultDemoUser;
    } catch {
      return defaultDemoUser;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('agripulse_token') || 'agripulse_demo_jwt_token');
  const [loading, setLoading] = useState(false);

  // Verify session on initial load or token changes
  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('agripulse_token') || 'agripulse_demo_jwt_token';
    if (!localStorage.getItem('agripulse_token')) {
      localStorage.setItem('agripulse_token', 'agripulse_demo_jwt_token');
      localStorage.setItem('agripulse_user', JSON.stringify(defaultDemoUser));
    }

    try {
      const profile = await authService.getCurrentUser();
      if (profile && profile.id) {
        setUser(profile);
        setToken(storedToken);
        localStorage.setItem('agripulse_user', JSON.stringify(profile));
      } else {
        setUser(defaultDemoUser);
        setToken(storedToken);
      }
    } catch {
      setUser(defaultDemoUser);
      setToken(storedToken);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    localStorage.setItem('agripulse_token', res.token);
    localStorage.setItem('agripulse_user', JSON.stringify(res));
    setToken(res.token);
    setUser(res);

    // Fetch complete user profile in background
    try {
      const fullProfile = await authService.getCurrentUser();
      if (fullProfile) {
        setUser(fullProfile);
        localStorage.setItem('agripulse_user', JSON.stringify(fullProfile));
      }
    } catch {
      // ignore
    }
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    localStorage.setItem('agripulse_token', res.token);
    localStorage.setItem('agripulse_user', JSON.stringify(res));
    setToken(res.token);
    setUser(res);

    try {
      const fullProfile = await authService.getCurrentUser();
      if (fullProfile) {
        setUser(fullProfile);
        localStorage.setItem('agripulse_user', JSON.stringify(fullProfile));
      }
    } catch {
      // ignore
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('agripulse_token');
      localStorage.removeItem('agripulse_user');
      setUser(null);
      setToken(null);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('agripulse_user', JSON.stringify(next));
      return next;
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateUser,
    refreshUser: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
