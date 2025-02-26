import React, { createContext, useState, useContext, ReactNode } from 'react';
import network from '../services/network/network';

interface AuthContextType {
  token: string | null;
  user: any | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const login = (token: string, userData: any) => {
    if (!token) {
      console.error('Token is missing');
      return;
    }
    setToken(token);
    setUser(userData);
    network.setToken(token);
    console.log("Token set:", token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    network.setToken('');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 