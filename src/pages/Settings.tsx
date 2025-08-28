import { useState } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { useAuth } from '@/contexts/AuthContext';
import { localStorageService } from '@/lib/localStorageService';
import { clearAllData, initializeDemoData, getDemoCredentials } from '@/lib/demoData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings as SettingsIcon, Database, Download, Upload, Trash2, RefreshCw, User, Shield, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserEditDialog from "@/components/Users/UserEditDialog";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExportData = () => {
    setIsExporting(true);
    try {
      const data = localStorageService.exportData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `timetracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "資料匯出成功",
        description: "備份檔案已下載到您的電腦",
      });
    } catch (error) {
      toast({
        title: "匯出失敗",
        description: "無法匯出資料，請重試",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            localStorageService.importData(data);
            toast({
              title: "資料匯入成功",
              description: "請重新整理頁面以查看匯入的資料",
            });
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } catch (error) {
            toast({
              title: "匯入失敗",
              description: "檔案格式不正確或已損壞",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearAllData = () => {
    clearAllData();
    toast({
      title: "資料已清除",
      description: "所有資料已從瀏覽器中刪除",
    });
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  };

  const handleResetDemoData = () => {
    clearAllData();
    initializeDemoData();
    toast({
      title: "示範資料已重置",
      description: "已載入新的示範資料",
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const stats = {
    users: localStorageService.getUsers().length,
    timeEntries: localStorageService.getTimeEntries().length,
    totalHours: localStorageService.getTimeEntries().reduce((sum, entry) => sum + entry.hours, 0)
  };

  const demoCredentials = getDemoCredentials();

  const handleUserUpdated = () => {
    setRefreshKey(prev => prev + 1);
    toast({
      title: "資料已更新",
      description: "個人資料已成功更新",
    });
  };

  return (
    <AppLayout currentPath="/settings">
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
            <SettingsIcon className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">系統設定</h1>
            <p className="text-muted-foreground">管理您的工時系統設定和資料</p>
          </div>
        </div>

        {/* 使用者資訊 */}
        <Card className="shadow-card" key={refreshKey}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>使用者資訊</span>
              </div>
              {user && (
                <UserEditDialog 
                  user={user} 
                  onUserUpdated={handleUserUpdated}
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">姓名</span>
              <span className="text-sm text-muted-foreground">{user?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">電子郵件</span>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">角色</span>
              <Badge variant={user?.role === "admin" ? "default" : "secondary"}>
                {user?.role === "admin" ? (
                  <>
                    <Shield className="h-3 w-3 mr-1" />
                    管理員
                  </>
                ) : (
                  "使用者"
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 系統統計 */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <span>系統統計</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold text-primary">{stats.users}</p>
                <p className="text-sm text-muted-foreground">使用者數量</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold text-accent">{stats.timeEntries}</p>
                <p className="text-sm text-muted-foreground">工時記錄</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold text-warning">{stats.totalHours.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">總工時 (小時)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 資料管理 */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <span>資料管理</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleExportData}
                disabled={isExporting}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>{isExporting ? "匯出中..." : "匯出資料"}</span>
              </Button>

              <Button
                onClick={handleImportData}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>匯入資料</span>
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium">示範資料管理</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4" />
                      <span>重置示範資料</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>重置示範資料</AlertDialogTitle>
                      <AlertDialogDescription>
                        這將清除所有現有資料並載入新的示範資料。此操作無法復原。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetDemoData}>
                        確認重置
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center space-x-2">
                      <Trash2 className="h-4 w-4" />
                      <span>清除所有資料</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>清除所有資料</AlertDialogTitle>
                      <AlertDialogDescription>
                        這將永久刪除所有使用者資料和工時記錄。此操作無法復原，請確保您已備份重要資料。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearAllData} className="bg-destructive text-destructive-foreground">
                        確認刪除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 示範帳戶資訊 */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>示範帳戶資訊</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm mb-2">管理員帳戶</h4>
                <p className="text-xs text-muted-foreground">
                  電子郵件: {demoCredentials.admin.email}<br />
                  密碼: {demoCredentials.admin.password}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm mb-2">一般使用者帳戶</h4>
                <p className="text-xs text-muted-foreground">
                  電子郵件: {demoCredentials.user1.email}<br />
                  密碼: {demoCredentials.user1.password}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 系統資訊 */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>系統資訊</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>版本: 1.0.0</p>
            <p>儲存方式: localStorage (瀏覽器本地儲存)</p>
            <p>資料同步: 不支援跨裝置同步</p>
            <p>建議: 定期匯出資料進行備份</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}