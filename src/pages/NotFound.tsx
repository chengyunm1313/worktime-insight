import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // 只在開發環境中記錄錯誤，避免在生產環境中產生不必要的 console 輸出
    if (import.meta.env.DEV) {
      console.warn(
        "404 Warning: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">頁面不存在</h1>
        <p className="text-gray-600 mb-6">
          抱歉，您訪問的頁面不存在或已被移除。
        </p>
        <Link to="/">
          <Button className="inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            返回首頁
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
