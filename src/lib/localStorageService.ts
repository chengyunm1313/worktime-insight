// localStorage 服務，用於管理本地資料儲存
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  password?: string; // 添加密碼欄位（可選，用於簡化的密碼管理）
}

export interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  subcategory: string;
  description: string;
  hours: number;
  user_id: string;
  createdAt: string;
}

class LocalStorageService {
  private readonly USERS_KEY = 'timetracker_users';
  private readonly TIME_ENTRIES_KEY = 'timetracker_time_entries';
  private readonly CURRENT_USER_KEY = 'timetracker_current_user';

  // 用戶管理
  getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index >= 0) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      
      // 如果更新的是當前使用者，也要更新當前使用者資訊
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        this.setCurrentUser(users[index]);
      }
      
      return users[index];
    }
    
    return null;
  }

  updateUserPassword(id: string, newPassword: string): boolean {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index >= 0) {
      users[index].password = newPassword;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return true;
    }
    
    return false;
  }

  verifyPassword(email: string, password: string): boolean {
    const user = this.getUserByEmail(email);
    if (!user) return false;
    
    // 如果使用者沒有設定密碼，使用預設密碼 'demo123'
    const userPassword = user.password || 'demo123';
    return userPassword === password;
  }

  deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length !== users.length) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(filteredUsers));
      
      // 如果刪除的是當前使用者，清除當前使用者資訊
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        this.setCurrentUser(null);
      }
      
      // 同時刪除該使用者的所有工時記錄
      const timeEntries = this.getTimeEntries();
      const filteredEntries = timeEntries.filter(entry => entry.user_id !== id);
      localStorage.setItem(this.TIME_ENTRIES_KEY, JSON.stringify(filteredEntries));
      
      return true;
    }
    
    return false;
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  // 當前用戶管理
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  // 工時記錄管理
  getTimeEntries(): TimeEntry[] {
    const entries = localStorage.getItem(this.TIME_ENTRIES_KEY);
    return entries ? JSON.parse(entries) : [];
  }

  getTimeEntriesByUser(userId: string): TimeEntry[] {
    return this.getTimeEntries().filter(entry => entry.user_id === userId);
  }

  saveTimeEntry(entry: Omit<TimeEntry, 'id' | 'createdAt'>): TimeEntry {
    const entries = this.getTimeEntries();
    const newEntry: TimeEntry = {
      ...entry,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };
    
    entries.push(newEntry);
    localStorage.setItem(this.TIME_ENTRIES_KEY, JSON.stringify(entries));
    return newEntry;
  }

  updateTimeEntry(id: string, updates: Partial<TimeEntry>): TimeEntry | null {
    const entries = this.getTimeEntries();
    const index = entries.findIndex(entry => entry.id === id);
    
    if (index >= 0) {
      entries[index] = { ...entries[index], ...updates };
      localStorage.setItem(this.TIME_ENTRIES_KEY, JSON.stringify(entries));
      return entries[index];
    }
    
    return null;
  }

  deleteTimeEntry(id: string): boolean {
    const entries = this.getTimeEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    
    if (filteredEntries.length !== entries.length) {
      localStorage.setItem(this.TIME_ENTRIES_KEY, JSON.stringify(filteredEntries));
      return true;
    }
    
    return false;
  }

  // 工具方法
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // 清除所有資料（用於測試或重置）
  clearAllData(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.TIME_ENTRIES_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // 匯出資料（用於備份）
  exportData(): { users: User[]; timeEntries: TimeEntry[] } {
    return {
      users: this.getUsers(),
      timeEntries: this.getTimeEntries(),
    };
  }

  // 匯入資料（用於還原）
  importData(data: { users: User[]; timeEntries: TimeEntry[] }): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(data.users));
    localStorage.setItem(this.TIME_ENTRIES_KEY, JSON.stringify(data.timeEntries));
  }
}

export const localStorageService = new LocalStorageService();