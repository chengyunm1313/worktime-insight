import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeDemoData } from './lib/demoData'

// 在應用啟動時初始化示範資料（如果沒有現有資料）
initializeDemoData();

createRoot(document.getElementById("root")!).render(<App />);
