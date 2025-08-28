import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 儲存的資料結構
interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  password: string; // 實際應用中不應明文儲存
  createdAt: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 從 localStorage 載入使用者資料
    const currentUser = localStorage.getItem('currentUser');
    const storedUsers = localStorage.getItem('users');
    
    // 初始化預設管理員帳戶
    if (!storedUsers) {
      const defaultAdmin: StoredUser = {
        id: 'admin-1',
        email: 'admin@company.com',
        name: '系統管理員',
        role: 'admin',
        password: 'admin123',
        createdAt: new Date().toISOString(),
      };
      
      const defaultUser: StoredUser = {
        id: 'user-1',
        email: 'user@company.com',
        name: '張小明',
        role: 'user',
        password: 'user123',
        createdAt: new Date().toISOString(),
      };
      
      const initialUsers = [defaultAdmin, defaultUser];
      localStorage.setItem('users', JSON.stringify(initialUsers));
      setUsers(initialUsers.map(u => ({ ...u, password: undefined } as any)));
    } else {
      const parsedUsers: StoredUser[] = JSON.parse(storedUsers);
      setUsers(parsedUsers.map(u => ({ 
        id: u.id, 
        email: u.email, 
        name: u.name, 
        role: u.role, 
        createdAt: u.createdAt 
      })));
    }
    
    if (currentUser) {
      const userData: User = JSON.parse(currentUser);
      setUser(userData);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = storedUsers.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error('電子郵件或密碼錯誤');
    }
    
    const userData: User = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role,
      createdAt: foundUser.createdAt,
    };
    
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const register = async (email: string, password: string, name: string) => {
    const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    // 檢查電子郵件是否已存在
    if (storedUsers.find(u => u.email === email)) {
      throw new Error('此電子郵件已被註冊');
    }
    
    // 檢查密碼長度
    if (password.length < 6) {
      throw new Error('密碼至少需要 6 個字元');
    }
    
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'user',
      password,
      createdAt: new Date().toISOString(),
    };
    
    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // 更新 users 狀態
    setUsers(updatedUsers.map(u => ({ 
      id: u.id, 
      email: u.email, 
      name: u.name, 
      role: u.role, 
      createdAt: u.createdAt 
    })));
    
    // 自動登入新註冊的使用者
    const userData: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
    
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
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