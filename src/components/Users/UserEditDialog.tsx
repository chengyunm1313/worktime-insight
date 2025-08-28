import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, User, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { localStorageService, User as UserType } from '@/lib/localStorageService';
import { useAuth } from '@/contexts/AuthContext';

interface UserEditDialogProps {
  user: UserType;
  onUserUpdated: () => void;
}

export default function UserEditDialog({ user, onUserUpdated }: UserEditDialogProps) {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 基本資訊表單
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  // 密碼表單
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const canEditUser = currentUser?.role === "admin" || currentUser?.id === user.id;
  const canEditRole = currentUser?.role === "admin" && currentUser?.id !== user.id;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 檢查電子郵件是否已被其他使用者使用
      if (email !== user.email) {
        const existingUser = localStorageService.getUserByEmail(email);
        if (existingUser && existingUser.id !== user.id) {
          throw new Error('此電子郵件已被其他使用者使用');
        }
      }

      const updatedUser = localStorageService.updateUser(user.id, {
        name,
        email,
        role,
      });

      if (updatedUser) {
        toast({
          title: "資料更新成功",
          description: "使用者資料已更新",
        });
        onUserUpdated();
        setOpen(false);
      } else {
        throw new Error('更新失敗');
      }
    } catch (error) {
      toast({
        title: "更新失敗",
        description: error instanceof Error ? error.message : "請重試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 如果不是管理員修改其他人密碼，需要驗證當前密碼
      if (currentUser?.id === user.id) {
        if (!localStorageService.verifyPassword(user.email, currentPassword)) {
          throw new Error('當前密碼錯誤');
        }
      }

      if (newPassword !== confirmPassword) {
        throw new Error('新密碼與確認密碼不符');
      }

      if (newPassword.length < 6) {
        throw new Error('密碼長度至少需要6個字元');
      }

      const success = localStorageService.updateUserPassword(user.id, newPassword);

      if (success) {
        toast({
          title: "密碼更新成功",
          description: "密碼已更新",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOpen(false);
      } else {
        throw new Error('更新失敗');
      }
    } catch (error) {
      toast({
        title: "密碼更新失敗",
        description: error instanceof Error ? error.message : "請重試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!canEditUser) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>編輯使用者</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">基本資料</TabsTrigger>
            <TabsTrigger value="password">修改密碼</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {canEditRole && (
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
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  取消
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "更新中..." : "更新資料"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="password" className="space-y-4">
            <form onSubmit={handleChangePassword} className="space-y-4">
              {currentUser?.id === user.id && (
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">當前密碼</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword">新密碼</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">確認新密碼</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  取消
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Lock className="h-4 w-4 mr-2" />
                  {isLoading ? "更新中..." : "更新密碼"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}