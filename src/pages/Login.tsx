import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Lock, User, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isRegister) {
        await register(email, password, name);
        toast({
          title: "註冊成功",
          description: "歡迎加入工時管理系統！",
        });
      } else {
        await login(email, password);
        toast({
          title: "登入成功",
          description: "歡迎回來！",
        });
      }
      navigate("/timeentry");
    } catch (error) {
      toast({
        title: isRegister ? "註冊失敗" : "登入失敗",
        description: error instanceof Error ? error.message : "請檢查您的資料",
        variant: "destructive",
      });
    }
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

        {/* 登入/註冊表單 */}
        <Card className="shadow-hover">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {isRegister ? "註冊帳戶" : "登入帳戶"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="請輸入您的姓名"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

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
                    placeholder={isRegister ? "請設定您的密碼" : "請輸入您的密碼"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={isRegister ? 6 : undefined}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-md"
              >
                {isRegister ? "註冊" : "登入"}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm"
              >
                {isRegister ? "已有帳戶？立即登入" : "沒有帳戶？立即註冊"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 提示訊息 */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            使用 localStorage 儲存，資料僅在此瀏覽器中保存
          </p>
        </div>
      </div>
    </div>
  );
}