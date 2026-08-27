import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('valenti_token') || null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Load user profile on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
        } else {
          // Token invalid or expired
          logout(false);
        }
      } catch (err) {
        console.error('Failed to authenticate with token:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!data.success) {
        showToast('error', data.message || 'Login failed');
        return { success: false, message: data.message };
      }

      setToken(data.data.token);
      setUser(data.data);
      localStorage.setItem('valenti_token', data.data.token);
      showToast('success', `Welcome back, ${data.data.name}`);
      return { success: true, user: data.data };
    } catch (err) {
      showToast('error', 'Network error while logging in');
      return { success: false, message: err.message };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();
      if (!data.success) {
        showToast('error', data.message || 'Registration failed');
        return { success: false, message: data.message };
      }

      setToken(data.data.token);
      setUser(data.data);
      localStorage.setItem('valenti_token', data.data.token);
      showToast('success', `Welcome to VALENTI ATELIER, ${data.data.name}`);
      return { success: true, user: data.data };
    } catch (err) {
      showToast('error', 'Network error during registration');
      return { success: false, message: err.message };
    }
  };

  const logout = useCallback((notify = true) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('valenti_token');
    if (notify) {
      showToast('info', 'You have been signed out.');
    }
  }, [showToast]);

  const updateProfile = async (formData) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setUser(prev => ({ ...prev, ...data.data }));
        showToast('success', 'Profile details updated');
        return { success: true };
      } else {
        showToast('error', data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      showToast('error', 'Failed to update profile');
      return { success: false, message: err.message };
    }
  };

  const addAddress = async (addressData) => {
    try {
      const res = await fetch('/api/auth/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressData)
      });
      const data = await res.json();
      if (data.success) {
        setUser(prev => ({ ...prev, addresses: data.data }));
        showToast('success', 'New delivery address saved');
        return { success: true };
      } else {
        showToast('error', data.message);
        return { success: false };
      }
    } catch (err) {
      showToast('error', 'Failed to save address');
      return { success: false };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const res = await fetch(`/api/auth/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setUser(prev => ({ ...prev, addresses: data.data }));
        showToast('info', 'Address removed');
        return { success: true };
      }
    } catch (err) {
      showToast('error', 'Failed to remove address');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      updateProfile,
      addAddress,
      deleteAddress
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
