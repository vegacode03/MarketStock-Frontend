import React, { createContext, useContext, useState } from 'react';
import { sellerApi } from '../api/seller';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [seller, setSeller] = useState(() => {
    try {
      const saved = localStorage.getItem('ms_seller');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const response = await sellerApi.login(email, password);
    const { token, seller: sellerData } = response.data;
    
    localStorage.setItem('ms_token', token);
    localStorage.setItem('ms_seller', JSON.stringify(sellerData));
    
    setSeller(sellerData);
  };

  const logout = () => {
    localStorage.removeItem('ms_token');
    localStorage.removeItem('ms_seller');
    setSeller(null);
  };

  const updateSeller = (data) => {
    localStorage.setItem('ms_seller', JSON.stringify(data));
    setSeller(data);
  };

  const isAuthenticated = !!seller;

  return (
    <AuthContext.Provider value={{ seller, login, logout, updateSeller, isAuthenticated }}>
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