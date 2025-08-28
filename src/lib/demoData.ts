import { localStorageService, User, TimeEntry } from './localStorageService';

// 示範使用者資料
const demoUsers: User[] = [
  {
    id: 'demo-admin-001',
    email: 'admin@demo.com',
    name: '系統管理員',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
    password: 'demo123',
  },
  {
    id: 'demo-user-001',
    email: 'user1@demo.com',
    name: '張小明',
    role: 'user',
    createdAt: '2024-01-02T00:00:00.000Z',
    password: 'demo123',
  },
  {
    id: 'demo-user-002',
    email: 'user2@demo.com',
    name: '李小華',
    role: 'user',
    createdAt: '2024-01-03T00:00:00.000Z',
    password: 'demo123',
  },
];

// 示範工時記錄 - 包含更多資料以展示圖表功能
const demoTimeEntries: Omit<TimeEntry, 'id' | 'createdAt'>[] = [
  // 張小明的記錄 - 近期資料
  {
    date: '2025-01-20',
    startTime: '09:00',
    endTime: '17:00',
    category: '開發工作',
    subcategory: '前端開發',
    description: '完成使用者介面設計和響應式布局調整',
    hours: 8.0,
    user_id: 'demo-user-001',
  },
  {
    date: '2025-01-21',
    startTime: '09:00',
    endTime: '12:00',
    category: '專案管理',
    subcategory: '需求分析',
    description: '分析客戶需求文件，整理功能規格',
    hours: 3.0,
    user_id: 'demo-user-001',
  },
  {
    date: '2025-01-21',
    startTime: '13:00',
    endTime: '17:30',
    category: '開發工作',
    subcategory: '後端開發',
    description: 'API 開發和資料庫設計',
    hours: 4.5,
    user_id: 'demo-user-001',
  },
  {
    date: '2025-01-22',
    startTime: '09:00',
    endTime: '17:00',
    category: '開發工作',
    subcategory: '系統測試',
    description: '進行單元測試和整合測試',
    hours: 8.0,
    user_id: 'demo-user-001',
  },
  {
    date: '2025-01-23',
    startTime: '09:00',
    endTime: '16:00',
    category: '客戶服務',
    subcategory: '技術支援',
    description: '協助客戶解決技術問題',
    hours: 7.0,
    user_id: 'demo-user-001',
  },
  
  // 李小華的記錄 - 近期資料
  {
    date: '2025-01-20',
    startTime: '09:00',
    endTime: '17:00',
    category: '客戶服務',
    subcategory: '客戶諮詢',
    description: '處理客戶技術諮詢和問題解答',
    hours: 8.0,
    user_id: 'demo-user-002',
  },
  {
    date: '2025-01-21',
    startTime: '09:00',
    endTime: '17:00',
    category: '休假',
    subcategory: '年假',
    description: '年假休息',
    hours: 8.0,
    user_id: 'demo-user-002',
  },
  {
    date: '2025-01-22',
    startTime: '09:00',
    endTime: '16:00',
    category: '行政事務',
    subcategory: '文件處理',
    description: '整理客戶合約和相關文件',
    hours: 7.0,
    user_id: 'demo-user-002',
  },
  {
    date: '2025-01-23',
    startTime: '10:00',
    endTime: '18:00',
    category: '客戶服務',
    subcategory: '產品演示',
    description: '為新客戶進行產品功能演示',
    hours: 8.0,
    user_id: 'demo-user-002',
  },

  // 管理員的記錄 - 近期資料
  {
    date: '2025-01-20',
    startTime: '09:00',
    endTime: '12:00',
    category: '專案管理',
    subcategory: '進度追蹤',
    description: '檢查專案進度，更新專案時程',
    hours: 3.0,
    user_id: 'demo-admin-001',
  },
  {
    date: '2025-01-20',
    startTime: '13:00',
    endTime: '17:00',
    category: '專案管理',
    subcategory: '會議協調',
    description: '主持團隊會議，協調各部門工作',
    hours: 4.0,
    user_id: 'demo-admin-001',
  },
  {
    date: '2025-01-21',
    startTime: '09:00',
    endTime: '17:00',
    category: '行政事務',
    subcategory: '報告撰寫',
    description: '撰寫月度工作報告和績效分析',
    hours: 8.0,
    user_id: 'demo-admin-001',
  },
  {
    date: '2025-01-22',
    startTime: '09:00',
    endTime: '15:00',
    category: '專案管理',
    subcategory: '風險評估',
    description: '評估專案風險並制定應對策略',
    hours: 6.0,
    user_id: 'demo-admin-001',
  },

  // 歷史資料 - 用於趨勢分析
  {
    date: '2024-12-15',
    startTime: '09:00',
    endTime: '17:00',
    category: '開發工作',
    subcategory: '前端開發',
    description: '12月份前端開發工作',
    hours: 8.0,
    user_id: 'demo-user-001',
  },
  {
    date: '2024-12-16',
    startTime: '09:00',
    endTime: '17:00',
    category: '開發工作',
    subcategory: '後端開發',
    description: '12月份後端開發工作',
    hours: 8.0,
    user_id: 'demo-user-001',
  },
  {
    date: '2024-11-15',
    startTime: '09:00',
    endTime: '17:00',
    category: '專案管理',
    subcategory: '需求分析',
    description: '11月份需求分析工作',
    hours: 8.0,
    user_id: 'demo-admin-001',
  },
  {
    date: '2024-11-16',
    startTime: '09:00',
    endTime: '17:00',
    category: '客戶服務',
    subcategory: '客戶諮詢',
    description: '11月份客戶服務工作',
    hours: 8.0,
    user_id: 'demo-user-002',
  },
  {
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '17:00',
    category: '行政事務',
    subcategory: '文件處理',
    description: '10月份行政事務工作',
    hours: 8.0,
    user_id: 'demo-user-002',
  },
  {
    date: '2024-10-16',
    startTime: '09:00',
    endTime: '17:00',
    category: '開發工作',
    subcategory: '系統測試',
    description: '10月份系統測試工作',
    hours: 8.0,
    user_id: 'demo-user-001',
  },
];

export function initializeDemoData(): void {
  // 檢查是否已有資料
  const existingUsers = localStorageService.getUsers();
  if (existingUsers.length > 0) {
    console.log('已存在使用者資料，跳過示範資料初始化');
    return;
  }

  // 初始化示範使用者
  demoUsers.forEach(user => {
    localStorageService.saveUser(user);
  });

  // 初始化示範工時記錄
  demoTimeEntries.forEach(entryData => {
    localStorageService.saveTimeEntry(entryData);
  });

  console.log('示範資料初始化完成');
}

export function clearAllData(): void {
  localStorageService.clearAllData();
  console.log('所有資料已清除');
}

export function getDemoCredentials() {
  return {
    admin: {
      email: 'admin@demo.com',
      password: 'demo123',
      name: '系統管理員'
    },
    user1: {
      email: 'user1@demo.com', 
      password: 'demo123',
      name: '張小明'
    },
    user2: {
      email: 'user2@demo.com',
      password: 'demo123', 
      name: '李小華'
    }
  };
}