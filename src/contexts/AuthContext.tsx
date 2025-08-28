import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorageService, User } from '@/lib/localStorageService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 檢查是否有已登入的用戶
    const currentUser = localStorageService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    const existingUser = localStorageService.getUserByEmail(email);
    
    if (!existingUser) {
      setIsLoading(false);
      throw new Error('用戶不存在');
    }
    
    // 驗證密碼
    if (!localStorageService.verifyPassword(email, password)) {
      setIsLoading(false);
      throw new Error('密碼錯誤');
    }
    
    localStorageService.setCurrentUser(existingUser);
    setUser(existingUser);
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    // 檢查用戶是否已存在
    const existingUser = localStorageService.getUserByEmail(email);
    if (existingUser) {
      setIsLoading(false);
      throw new Error('此電子郵件已被註冊');
    }
    
    // 創建新用戶
    const newUser: User = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      email,
      name,
      role: 'user',
      createdAt: new Date().toISOString(),
      password: password, // 儲存密碼
    };
    
    localStorageService.saveUser(newUser);
    localStorageService.setCurrentUser(newUser);
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    localStorageService.setCurrentUser(null);
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
    }}>
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