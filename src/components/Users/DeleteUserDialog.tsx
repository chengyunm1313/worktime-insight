import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { localStorageService, User } from '@/lib/localStorageService';
import { useAuth } from '@/contexts/AuthContext';

interface DeleteUserDialogProps {
  user: User;
  onUserDeleted: () => void;
}

export default function DeleteUserDialog({ user, onUserDeleted }: DeleteUserDialogProps) {
  const { user: currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // 檢查是否可以刪除此使用者
  const canDelete = currentUser?.role === "admin" && currentUser?.id !== user.id;

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const success = localStorageService.deleteUser(user.id);

      if (success) {
        toast({
          title: "使用者已刪除",
          description: `已成功刪除使用者 ${user.name}`,
        });

        // 如果刪除的是當前使用者，需要登出
        if (currentUser?.id === user.id) {
          await logout();
          return;
        }

        onUserDeleted();
      } else {
        throw new Error('刪除失敗');
      }
    } catch (error) {
      toast({
        title: "刪除失敗",
        description: error instanceof Error ? error.message : "請重試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!canDelete) {
    return null;
  }

  // 計算使用者的工時記錄數
  const userEntries = localStorageService.getTimeEntriesByUser(user.id);
  const entryCount = userEntries.length;
  const totalHours = userEntries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <span>確認刪除使用者</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>您確定要刪除使用者 <strong>{user.name}</strong> 嗎？</p>
            <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
              <p><strong>電子郵件：</strong>{user.email}</p>
              <p><strong>角色：</strong>{user.role === 'admin' ? '管理員' : '使用者'}</p>
              <p><strong>工時記錄：</strong>{entryCount} 筆記錄，共 {totalHours.toFixed(1)} 小時</p>
            </div>
            <p className="text-destructive font-medium">
              ⚠️ 此操作將同時刪除該使用者的所有工時記錄，且無法復原！
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "刪除中..." : "確認刪除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}