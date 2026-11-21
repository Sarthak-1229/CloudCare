import React, { useState, useEffect } from 'react';
import api from './api';
import { MOCK_USERS } from './mockData';
import { AuthContext } from './AuthContextObject';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cloudcare_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cloudcare_token') || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const [apiHealth, setApiHealth] = useState({ healthy: false, checked: false });

  // Probe API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await api.get('/health');
        if (res.data && res.data.status === 'ok') {
          setApiHealth({ healthy: true, checked: true });
        } else {
          setApiHealth({ healthy: false, checked: true });
        }
      } catch {
        setApiHealth({ healthy: false, checked: true });
      }
    };
    checkHealth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Attempt real backend login first
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.data) {
        const { token, user } = res.data.data;
        setToken(token);
        setUser(user);
        setIsMockMode(false);
        localStorage.setItem('cloudcare_token', token);
        localStorage.setItem('cloudcare_user', JSON.stringify(user));
        return { success: true, user };
      }
    } catch (err) {
      // If endpoint is not ready (Phase 1 404/503/network error), gracefully fall back to mock
      const isEndpointPending = !err.response || err.response.status === 404 || err.response.status === 503;
      if (isEndpointPending) {
        const matched = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (matched) {
          const fakeToken = `mock-jwt-token-${matched.role.toLowerCase()}-${Date.now()}`;
          setToken(fakeToken);
          setUser(matched);
          setIsMockMode(true);
          localStorage.setItem('cloudcare_token', fakeToken);
          localStorage.setItem('cloudcare_user', JSON.stringify(matched));
          return { success: true, user: matched, isMock: true };
        }
      }
      throw new Error(err.response?.data?.error?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data && res.data.data) {
        return { success: true, user: res.data.data };
      }
    } catch (err) {
      const isEndpointPending = !err.response || err.response.status === 404 || err.response.status === 503;
      if (isEndpointPending) {
        // Mock registration
        const newUser = {
          id: Date.now(),
          name,
          email,
          role: 'PATIENT',
          patientId: Date.now(),
        };
        const fakeToken = `mock-jwt-token-patient-${Date.now()}`;
        setToken(fakeToken);
        setUser(newUser);
        setIsMockMode(true);
        localStorage.setItem('cloudcare_token', fakeToken);
        localStorage.setItem('cloudcare_user', JSON.stringify(newUser));
        return { success: true, user: newUser, isMock: true };
      }
      throw new Error(err.response?.data?.error?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cloudcare_token');
    localStorage.removeItem('cloudcare_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isMockMode,
        apiHealth,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
