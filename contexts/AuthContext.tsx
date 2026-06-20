'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/mocks';
import { useMockApi } from '@/lib/useMockApi';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasModuleAccess: (moduleId: string) => boolean;
  canAccessModule: (modulePath: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { users, getRolesForUser, getModulesForRole, modules } = useMockApi();

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      // Find user by email
      const foundUser = users.find(u => u.email === email && u.isActive);
      
      if (!foundUser) {
        setIsLoading(false);
        return { success: false, message: 'User not found or inactive' };
      }

      // Check password (in production, this would be hashed)
      if (foundUser.password !== password) {
        setIsLoading(false);
        return { success: false, message: 'Invalid password' };
      }

      // Update last login
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toISOString(),
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsLoading(false);
      return { success: true, message: 'Login successful' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // Get user's roles and check permissions
    const userRoles = getRolesForUser(user.id);
    return userRoles.some(role => role.permissions.includes(permission));
  };

  const hasModuleAccess = (moduleId: string): boolean => {
    if (!user) return false;
    
    // Admin has access to all modules
    if (user.role === 'admin') return true;
    
    // Get user's roles and check module access
    const userRoles = getRolesForUser(user.id);
    const accessibleModules = userRoles.flatMap(role => getModulesForRole(role.id));
    
    return accessibleModules.some(module => module.id === moduleId);
  };

  const canAccessModule = (modulePath: string): boolean => {
    if (!user) return false;
    
    // Admin can access all modules
    if (user.role === 'admin') return true;
    
    // Find module by path
    const module = modules.find(m => m.path === modulePath);
    if (!module) return false;
    
    return hasModuleAccess(module.id);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    hasPermission,
    hasModuleAccess,
    canAccessModule,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

