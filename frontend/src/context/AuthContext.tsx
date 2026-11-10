import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string, workspace?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : {
      id: 'u-1',
      name: 'Priya S.',
      email: 'priya@acme-corp.com',
      role: 'ADMIN' as Role,
      organizationId: 'org-acme',
      organizationName: 'Acme Corp',
      workspaceSlug: 'acme-corp'
    };
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token') || 'demo-jwt-token');

  const login = async (email: string, pass: string, workspace: string = 'acme-corp'): Promise<boolean> => {
    let role: Role = 'DEVELOPER';
    let name = 'Developer User';

    if (email.includes('priya') || email.includes('admin')) {
      role = 'ADMIN';
      name = 'Priya S.';
    } else if (email.includes('arun')) {
      role = 'DEVELOPER';
      name = 'Arun P.';
    } else if (email.includes('meera')) {
      role = 'DEVELOPER';
      name = 'Meera K.';
    } else if (email.includes('ravi')) {
      role = 'VIEWER';
      name = 'Ravi T.';
    }

    const newUser: User = {
      id: 'u-user',
      name,
      email,
      role,
      organizationId: 'org-acme',
      organizationName: 'Acme Corp',
      workspaceSlug: workspace || 'acme-corp'
    };

    setUser(newUser);
    setToken('jwt-session-token');
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', 'jwt-session-token');
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
