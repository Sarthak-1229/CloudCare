import React, { useState, useEffect } from 'react';
import api from './api';
import { MOCK_USERS } from './mockData';
import { AuthContext } from './AuthContextObject';

const cleanEmailInput = (raw) =>
  typeof raw === 'string' ? raw.replace(/[\s"'`<>]+/g, '').toLowerCase() : '';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cloudcare_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('cloudcare_token') || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const [apiHealth, setApiHealth] = useState({ healthy: false, checked: false });

  // Probe API health only when an administrator is active
  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    let mounted = true;
    const checkHealth = async () => {
      try {
        const res = await api.get('/health');
        if (mounted) {
          setApiHealth({ healthy: res.data?.status === 'ok', checked: true });
        }
      } catch {
        if (mounted) {
          setApiHealth({ healthy: false, checked: true });
        }
      }
    };
    checkHealth();
    return () => {
      mounted = false;
    };
  }, [user?.role]);

  const login = async (email, password) => {
    setIsLoading(true);
    const sanitizedEmail = cleanEmailInput(email);
    const sanitizedPassword = typeof password === 'string' ? password.trim() : '';

    try {
      const res = await api.post('/auth/login', {
        email: sanitizedEmail,
        password: sanitizedPassword,
      });
      if (res.data && res.data.data) {
        const { token: jwtToken, user: loggedUser } = res.data.data;
        setToken(jwtToken);
        setUser(loggedUser);
        setIsMockMode(false);
        localStorage.setItem('cloudcare_token', jwtToken);
        localStorage.setItem('cloudcare_user', JSON.stringify(loggedUser));
        return { success: true, user: loggedUser };
      }
    } catch (err) {
      // Only fall back to mock data if backend is completely unreachable (offline local dev)
      const isNetworkOffline = !err.response || err.response.status === 503;
      if (isNetworkOffline) {
        const matched = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === sanitizedEmail
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
      throw new Error(err.response?.data?.error?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    const sanitizedName = typeof name === 'string' ? name.trim() : '';
    const sanitizedEmail = cleanEmailInput(email);
    const sanitizedPassword = typeof password === 'string' ? password.trim() : '';

    try {
      const res = await api.post('/auth/register', {
        name: sanitizedName,
        email: sanitizedEmail,
        password: sanitizedPassword,
      });
      if (res.data && res.data.data) {
        // Automatically authenticate newly registered patient
        return await login(sanitizedEmail, sanitizedPassword);
      }
    } catch (err) {
      const isNetworkOffline = !err.response || err.response.status === 503;
      if (isNetworkOffline) {
        const newUser = {
          id: Date.now(),
          name: sanitizedName,
          email: sanitizedEmail,
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
      throw new Error(err.response?.data?.error?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsMockMode(false);
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
