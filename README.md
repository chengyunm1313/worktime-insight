# 工時管理系統 - 純前端解決方案

一個使用 localStorage 的純前端工時追蹤應用，適合個人使用或展示用途。

## 🌐 線上演示

**立即體驗**: [https://chengyunm1313.github.io/worktime-insight](https://chengyunm1313.github.io/worktime-insight)

## 🚀 快速開始

想要立即體驗系統功能？使用以下測試帳戶：

**管理員帳戶** - 體驗完整功能
- 帳號：`admin@demo.com`
- 密碼：`demo123`

**一般使用者** - 體驗基本功能  
- 帳號：`user1@demo.com`
- 密碼：`demo123`

## 🚀 功能特色

- **工時輸入**: 快速記錄工作時間，支援分類和詳細描述
- **統計分析**: 
  - 圓餅圖和長條圖視覺化工時分布
  - 月度趨勢分析
  - 多種時間範圍選擇（週、月、季、年）
  - 可展開的詳細分類統計
- **使用者管理**: 管理團隊成員和查看所有使用者的工時統計（管理員功能）
- **系統設定**: 
  - 資料匯出/匯入功能
  - 示範資料管理
  - 系統統計資訊
  - 使用者資訊管理
- **純前端**: 使用 localStorage 儲存，無需後端服務
- **響應式設計**: 支援桌面和行動裝置

## 🛠 技術架構

- **前端框架**: React 18 + TypeScript
- **建構工具**: Vite
- **UI 組件**: shadcn/ui + Tailwind CSS
- **資料儲存**: localStorage
- **路由**: React Router
- **狀態管理**: React Context API

## 📦 安裝與執行

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建構生產版本
npm run build

# 預覽生產版本
npm run preview

# 部署到 GitHub Pages
npm run deploy
```

啟動後開啟瀏覽器前往 `http://localhost:5173`，使用上述測試帳戶即可開始體驗！

## 🎯 使用說明

### 首次使用

1. 開啟應用後，點擊「立即開始」或直接前往登入頁面
2. 使用預設管理員帳戶登入，或註冊新帳戶
3. 登入後即可開始使用各項功能

### 🔑 測試帳戶

為了方便測試，系統提供以下預設帳戶：

#### 管理員帳戶
- **電子郵件**: `admin@demo.com`
- **密碼**: `demo123`
- **權限**: 完整的系統管理權限

#### 一般使用者帳戶
- **電子郵件**: `user1@demo.com` / `user2@demo.com`
- **密碼**: `demo123`
- **權限**: 個人工時記錄管理

> 💡 **提示**: 首次開啟應用時會自動載入示範資料，包含上述測試帳戶和範例工時記錄

### 工時記錄

1. 前往「工時輸入」頁面
2. 選擇工作日期、開始和結束時間
3. 選擇工作類別和次類別
4. 填寫工作內容描述
5. 點擊「儲存工時記錄」

### 統計分析

1. 前往「統計分析」頁面
2. 選擇時間範圍（本週、本月、過去半年、過去一年或自訂範圍）
3. 查看總工時、工作天數和日均工時
4. 使用分頁功能查看不同類型的分析：
   - **總覽**: 圓餅圖和長條圖顯示工時分布
   - **圖表分析**: 詳細的工時與記錄數對比圖表
   - **趨勢分析**: 月度工時趨勢圖（需選擇較長時間範圍）
   - **詳細資料**: 可展開的分類統計和明細表

### 使用者管理（管理員功能）

1. 管理員可以在「使用者管理」頁面查看所有使用者
2. 查看每個使用者的總工時和記錄數
3. 新增使用者：
   - 設定姓名、電子郵件和密碼
   - 指定使用者角色（管理員/使用者）
4. 編輯使用者資料：
   - 修改姓名和電子郵件
   - 調整使用者角色（管理員/使用者）
   - 重設使用者密碼
5. 刪除使用者：
   - 刪除使用者帳戶和所有相關工時記錄
   - 管理員無法刪除自己的帳戶
6. 使用者可以修改自己的個人資料和密碼

### 系統設定

1. 前往「設定」頁面管理系統配置
2. 編輯個人資料和修改密碼
3. 查看使用者資訊和系統統計
4. 匯出/匯入資料進行備份和還原
5. 重置示範資料或清除所有資料
6. 查看示範帳戶登入資訊
5. 查看示範帳戶登入資訊

## 📊 資料儲存

本應用使用瀏覽器的 localStorage 來儲存資料：

- **使用者資料**: 帳戶資訊、角色權限
- **工時記錄**: 所有的工時輸入資料
- **登入狀態**: 當前登入使用者資訊

### 資料備份與還原

應用提供資料匯出和匯入功能：

```javascript
// 匯出資料
const data = localStorageService.exportData();
console.log(JSON.stringify(data, null, 2));

// 匯入資料
localStorageService.importData(data);
```

## 🔒 權限管理

系統支援兩種使用者角色：

- **管理員 (admin)**: 可以查看所有使用者的資料和統計
- **一般使用者 (user)**: 只能查看和編輯自己的資料

## 🌟 工作類別

系統預設提供以下工作類別：

- **開發工作**: 前端開發、後端開發、資料庫設計、系統測試、程式碼審查
- **專案管理**: 需求分析、進度追蹤、會議協調、文件整理、風險評估
- **客戶服務**: 客戶諮詢、問題解決、技術支援、產品演示、培訓服務
- **行政事務**: 文件處理、報告撰寫、資料整理、會議記錄、其他行政
- **休假**: 年假、病假、事假、特休、補休

## 📱 瀏覽器支援

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## ⚠️ 注意事項

- 資料僅儲存在本地瀏覽器中，不會同步到其他裝置
- 清除瀏覽器資料會導致所有記錄遺失
- 建議定期匯出資料進行備份
- 適合個人使用或展示用途，不建議用於生產環境的團隊協作

## 🚀 部署

### GitHub Pages 部署

本專案已配置好 GitHub Pages 自動部署，按照以下步驟即可部署：

#### 1. 準備工作
```bash
# 確保已安裝所有依賴
npm install

# 測試建置是否正常
npm run build
```

#### 2. 部署到 GitHub Pages
```bash
# 一鍵部署（會自動建置並推送到 gh-pages 分支）
npm run deploy
```

#### 3. 設定 GitHub 倉庫
1. 前往您的 GitHub 倉庫設定頁面
2. 找到 "Pages" 設定區塊
3. 在 "Source" 中選擇 "Deploy from a branch"
4. 選擇 `gh-pages` 分支和 `/ (root)` 資料夾
5. 點擊 "Save" 儲存設定

#### 4. 配置 Base Path（重要！）

如果您的倉庫名稱不是 `worktime-insight`，需要修改 `vite.config.ts` 中的 base 設定：

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/您的倉庫名稱/' : '/',
  // ... 其他配置
}));
```

同時更新 `package.json` 中的 homepage：

```json
{
  "homepage": "https://您的GitHub用戶名.github.io/您的倉庫名稱"
}
```

#### 5. 訪問您的網站
部署完成後，您的網站將可以通過以下網址訪問：
```
https://[您的GitHub用戶名].github.io/[倉庫名稱]
```

例如：`https://chengyunm1313.github.io/worktime-insight`

#### 6. 更新部署
當您需要更新網站內容時：
```bash
# 修改程式碼後，重新部署
npm run deploy
```

### ⚙️ 自訂配置

#### 修改倉庫名稱時的必要設定

如果您 Fork 了這個專案並重新命名倉庫，請務必修改以下檔案：

**1. 修改 `vite.config.ts`：**
```typescript
// 原始配置（倉庫名稱為 worktime-insight）
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/worktime-insight/' : '/',
  // ... 其他配置
}));

// 修改後的配置（假設您的倉庫名稱為 my-time-tracker）
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/my-time-tracker/' : '/',
  // ... 其他配置保持不變
}));
```

**2. 修改 `package.json`：**
```json
// 原始配置
{
  "homepage": "https://chengyunm1313.github.io/worktime-insight"
}

// 修改後的配置（假設您的用戶名為 yourname，倉庫名為 my-time-tracker）
{
  "homepage": "https://yourname.github.io/my-time-tracker"
}
```

**3. 重新建置和部署：**
```bash
npm run build
npm run deploy
```

### 其他部署選項

本應用為純前端專案，也可以部署到其他靜態網站託管服務：

- **Vercel**: 連接 GitHub 倉庫自動部署
- **Netlify**: 拖拽 `dist` 資料夾或連接 Git
- **Firebase Hosting**: 使用 Firebase CLI 部署
- **GitHub Pages**: 使用上述方法部署

### 部署注意事項

1. **路徑設定**: 
   - 專案預設配置為 `/worktime-insight/` 路徑
   - 如果倉庫名稱不同，**必須**修改 `vite.config.ts` 中的 `base` 設定
   - 同時更新 `package.json` 中的 `homepage` 欄位
2. **瀏覽器相容性**: 支援現代瀏覽器（Chrome 80+, Firefox 75+, Safari 13+, Edge 80+）
3. **資料儲存**: 使用 localStorage，資料僅存在使用者本地瀏覽器
4. **HTTPS**: 建議使用 HTTPS 以確保最佳安全性
5. **GitHub Pages 設定**: 確保在倉庫設定中選擇 `gh-pages` 分支作為來源

## 🚀 快速部署總結

想要快速部署您自己的版本？

```bash
# 1. 克隆或 Fork 專案
git clone https://github.com/chengyunm1313/worktime-insight.git
cd worktime-insight

# 2. 安裝依賴
npm install

# 3. 如果倉庫名稱不同，修改 vite.config.ts 中的 base 路徑
# base: mode === 'production' ? '/您的倉庫名稱/' : '/'

# 4. 部署到您的 GitHub Pages
npm run deploy
```

⚠️ **重要提醒**: 如果您的倉庫名稱不是 `worktime-insight`，請務必修改 `vite.config.ts` 和 `package.json` 中的路徑設定！

### 📋 部署前檢查清單

在執行 `npm run deploy` 之前，請確認：

- [ ] 已安裝所有依賴 (`npm install`)
- [ ] 本地建置成功 (`npm run build`)
- [ ] 如果倉庫名稱不同，已修改 `vite.config.ts` 中的 `base` 路徑
- [ ] 如果倉庫名稱不同，已修改 `package.json` 中的 `homepage`
- [ ] Git 倉庫已推送到 GitHub
- [ ] GitHub Pages 設定已啟用並選擇 `gh-pages` 分支

詳細部署說明請參考 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📄 授權

MIT License
