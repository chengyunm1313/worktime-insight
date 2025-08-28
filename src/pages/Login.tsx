import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Lock, User } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 這裡會整合 Supabase 認證
    console.log("登入:", { email, password });
    
    // 模擬登入成功後跳轉
    window.location.href = "/timeentry";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-accent-light/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo 和標題 */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg">
            <Clock className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-foreground">工時管理系統</h1>
          <p className="mt-2 text-muted-foreground">登入您的帳戶以開始使用</p>
        </div>

        {/* 登入表單 */}
        <Card className="shadow-hover">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">登入帳戶</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="請輸入您的電子郵件"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密碼</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="請輸入您的密碼"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-md"
              >
                登入
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 提示訊息 */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            需要啟用 Supabase 整合以實現完整的認證功能
          </p>
        </div>
      </div>
    </div>
  );
}