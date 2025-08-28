import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { localStorageService, User } from '@/lib/localStorageService';

interface AddUserDialogProps {
  onUserAdded: () => void;
}

export default function AddUserDialog({ onUserAdded }: AddUserDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 表單狀態
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<'admin' | 'user'>('user');

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRole('user');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 驗證表單
      if (!name.trim()) {
        throw new Error('請輸入姓名');
      }

      if (!email.trim()) {
        throw new Error('請輸入電子郵件');
      }

      if (!password) {
        throw new Error('請輸入密碼');
      }

      if (password.length < 6) {
        throw new Error('密碼長度至少需要6個字元');
      }

      if (password !== confirmPassword) {
        throw new Error('密碼與確認密碼不符');
      }

      // 檢查電子郵件是否已存在
      const existingUser = localStorageService.getUserByEmail(email);
      if (existingUser) {
        throw new Error('此電子郵件已被使用');
      }

      // 創建新使用者
      const newUser: User = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        email: email.trim(),
        name: name.trim(),
        role,
        createdAt: new Date().toISOString(),
        password,
      };

      localStorageService.saveUser(newUser);

      toast({
        title: "使用者新增成功",
        description: `已成功新增使用者 ${name}`,
      });

      resetForm();
      setOpen(false);
      onUserAdded();
    } catch (error) {
      toast({
        title: "新增失敗",
        description: error instanceof Error ? error.message : "請重試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          新增使用者
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>新增使用者</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="請輸入姓名"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">電子郵件 *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入電子郵件"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">角色</Label>
            <Select value={role} onValueChange={(value: 'admin' | 'user') => setRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">使用者</SelectItem>
                <SelectItem value="admin">管理員</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">密碼 *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入密碼（至少6個字元）"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">確認密碼 *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="請再次輸入密碼"
              required
              minLength={6}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "新增中..." : "新增使用者"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}