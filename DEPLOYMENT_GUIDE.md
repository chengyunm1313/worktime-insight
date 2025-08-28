# 部署指南

本文件詳細說明如何將工時管理系統部署到 GitHub Pages 和其他平台。

## 🚀 GitHub Pages 部署（推薦）

### 前置需求
- GitHub 帳戶
- Git 已安裝並配置
- Node.js 18+ 已安裝

### 步驟 1: 準備專案

```bash
# 克隆或下載專案
git clone https://github.com/chengyunm1313/worktime-insight.git
cd worktime-insight

# 安裝依賴
npm install
```

### 步驟 2: 配置部署設定

專案已預先配置好部署設定，包括：

1. **package.json** 中的部署腳本：
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://[您的用戶名].github.io/[倉庫名稱]"
}
```

2. **vite.config.ts** 中的 base path 設定：
```typescript
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/worktime-insight/' : '/',
  // ... 其他配置
}));
```

### 步驟 3: 執行部署

```bash
# 測試建置
npm run build

# 部署到 GitHub Pages
npm run deploy
```

### 步驟 4: 設定 GitHub 倉庫

1. 前往 GitHub 倉庫頁面
2. 點擊 "Settings" 標籤
3. 在左側選單找到 "Pages"
4. 在 "Source" 區域選擇：
   - Source: "Deploy from a branch"
   - Branch: "gh-pages"
   - Folder: "/ (root)"
5. 點擊 "Save"

### 步驟 5: 訪問網站

部署完成後（通常需要 1-5 分鐘），您可以通過以下網址訪問：
```
https://[您的GitHub用戶名].github.io/[倉庫名稱]
```

## 🔄 更新部署

當您修改程式碼後，重新部署很簡單：

```bash
# 提交您的更改到 main 分支
git add .
git commit -m "更新功能"
git push origin main

# 重新部署
npm run deploy
```

## 🌐 其他部署選項

### Vercel 部署

1. 前往 [Vercel](https://vercel.com)
2. 連接您的 GitHub 帳戶
3. 選擇倉庫並部署
4. Vercel 會自動偵測 Vite 專案並配置

### Netlify 部署

#### 方法 1: 拖拽部署
```bash
npm run build
```
然後將 `dist` 資料夾拖拽到 Netlify 部署頁面

#### 方法 2: Git 連接
1. 前往 [Netlify](https://netlify.com)
2. 連接 GitHub 倉庫
3. 設定建置命令：`npm run build`
4. 設定發布目錄：`dist`

### Firebase Hosting

```bash
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入 Firebase
firebase login

# 初始化專案
firebase init hosting

# 建置專案
npm run build

# 部署
firebase deploy
```

## 🛠️ 自訂部署配置

### 修改 Base Path

如果您的倉庫名稱不是 `worktime-insight`，需要修改 `vite.config.ts`：

```typescript
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/您的倉庫名稱/' : '/',
  // ...
}));
```

### 修改 Homepage

同時更新 `package.json` 中的 homepage：

```json
{
  "homepage": "https://您的用戶名.github.io/您的倉庫名稱"
}
```

## 🔍 故障排除

### 常見問題

**Q: 部署後頁面顯示 404**
A: 檢查 GitHub Pages 設定是否正確選擇了 `gh-pages` 分支

**Q: 樣式或資源載入失敗**
A: 確認 `vite.config.ts` 中的 `base` 路徑設定正確

**Q: 部署命令失敗**
A: 確保已安裝 `gh-pages` 套件：`npm install --save-dev gh-pages`

**Q: 更新後網站沒有變化**
A: 清除瀏覽器快取，或等待 GitHub Pages 更新（最多 10 分鐘）

### 檢查部署狀態

您可以在 GitHub 倉庫的 "Actions" 標籤中查看部署狀態和日誌。

## 📋 部署檢查清單

部署前請確認：

- [ ] 所有依賴已安裝 (`npm install`)
- [ ] 本地建置成功 (`npm run build`)
- [ ] Git 倉庫已推送到 GitHub
- [ ] `vite.config.ts` 中的 base path 正確
- [ ] `package.json` 中的 homepage 正確
- [ ] GitHub Pages 設定已啟用

## 🎯 效能優化建議

1. **啟用 Gzip 壓縮**: GitHub Pages 自動啟用
2. **使用 CDN**: GitHub Pages 已包含全球 CDN
3. **圖片優化**: 使用適當的圖片格式和大小
4. **程式碼分割**: 考慮使用動態 import 減少初始載入時間

## 📞 支援

如果遇到部署問題：

1. 檢查 [GitHub Pages 文件](https://docs.github.com/en/pages)
2. 查看專案的 Issues 頁面
3. 參考 [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)

---

**提示**: 第一次部署可能需要幾分鐘時間，請耐心等待。後續更新通常會更快。