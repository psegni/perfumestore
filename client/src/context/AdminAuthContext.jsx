import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { adminApi } from '../utils/adminApi';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(null);

  const checkStatus = useCallback(async () => {
    try {
      const data = await adminApi.status();
      setRegistered(data.registered);
    } catch {
      setRegistered(false);
    }
  }, []);

  const loadAdmin = useCallback(async () => {
    const token = localStorage.getItem('shito-admin-token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await adminApi.me();
      setAdmin(data.admin);
    } catch {
      localStorage.removeItem('shito-admin-token');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
    loadAdmin();
  }, [checkStatus, loadAdmin]);

  const login = async (email, password) => {
    const data = await adminApi.login({ email, password });
    localStorage.setItem('shito-admin-token', data.token);
    setAdmin(data.admin);
    setRegistered(true);
    return data;
  };

  const register = async (username, email, password) => {
    const data = await adminApi.register({ username, email, password });
    setRegistered(true);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('shito-admin-token');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        registered,
        login,
        register,
        logout,
        checkStatus,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
