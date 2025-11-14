import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  uid: string;
  email: string;
  name: string;
  age: number;
  location: {
    city: string;
    lat: number;
    lng: number;
  };
  preferred_language: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('kanasu_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    // TODO: Integrate with Firebase Auth
    // For now, mock implementation
    const newUser: User = {
      uid: Math.random().toString(36).substr(2, 9),
      email,
      name: userData.name || '',
      age: userData.age || 18,
      location: userData.location || { city: '', lat: 0, lng: 0 },
      preferred_language: userData.preferred_language || 'en',
    };
    
    localStorage.setItem('kanasu_user', JSON.stringify(newUser));
    localStorage.setItem('preferred_language', newUser.preferred_language);
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    // TODO: Integrate with Firebase Auth
    // For now, mock implementation
    const mockUser: User = {
      uid: Math.random().toString(36).substr(2, 9),
      email,
      name: 'Demo User',
      age: 20,
      location: { city: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
      preferred_language: localStorage.getItem('preferred_language') || 'en',
    };
    
    localStorage.setItem('kanasu_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = async () => {
    localStorage.removeItem('kanasu_user');
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('kanasu_user', JSON.stringify(updatedUser));
    
    if (userData.preferred_language) {
      localStorage.setItem('preferred_language', userData.preferred_language);
    }
    
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};