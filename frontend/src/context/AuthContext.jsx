import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'agrivision_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate existing token on boot
  const verifyToken = useCallback(async (authToken) => {
    if (!authToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await api.getMe();
      setUser(profile);
    } catch (err) {
      console.warn('Stored token is invalid or expired:', err?.response?.data?.detail || err.message);
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyToken(token);
  }, [token, verifyToken]);

  // Log in
  const login = async (email, password) => {
    const res = await api.login(email, password);
    const accessToken = res.access_token;
    localStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);

    // Fetch user profile immediately
    const profile = await api.getMe();
    setUser(profile);
    return profile;
  };

  // Register
  const register = async (name, email, password) => {
    await api.register(name, email, password);
    // After successful registration, automatically log in
    return await login(email, password);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
