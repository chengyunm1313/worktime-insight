import { useState, useEffect } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { useAuth } from '@/contexts/AuthContext';
import { localStorageService, User } from '@/lib/localStorageService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users as UsersIcon, UserCheck, Clock } from "lucide-react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import UserEditDialog from "@/components/Users/UserEditDialog";
import AddUserDialog from "@/components/Users/AddUserDialog";
import DeleteUserDialog from "@/components/Users/DeleteUserDialog";

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<Record<string, { totalHours: number; totalEntries: number }>>({});

  const fetchUsers = () => {
    if (currentUser?.role === "admin") {
      const allUsers = localStorageService.getUsers();
      setUsers(allUsers);

      // 計算每個使用者的統計資料
      const stats: Record<string, { totalHours: number; totalEntries: number }> = {};
      allUsers.forEach(user => {
        const entries = localStorageService.getTimeEntriesByUser(user.id);
        stats[user.id] = {
          totalHours: entries.reduce((sum, entry) => sum + entry.hours, 0),
          totalEntries: entries.length
        };
      });
      setUserStats(stats);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  if (currentUser?.role !== "admin") {
    return (
      <AppLayout currentPath="/users">
        <div className="p-6">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">權限不足</h2>
              <p className="text-muted-foreground">只有管理員可以查看使用者列表</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout currentPath="/users">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
              <UsersIcon className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">使用者管理</h1>
              <p className="text-muted-foreground">管理系統中的所有使用者</p>
            </div>
          </div>
          <AddUserDialog onUserAdded={fetchUsers} />
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">總使用者數</p>
                  <p className="text-3xl font-bold text-primary">{users.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">管理員</p>
                  <p className="text-3xl font-bold text-accent">
                    {users.filter(u => u.role === "admin").length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">一般使用者</p>
                  <p className="text-3xl font-bold text-warning">
                    {users.filter(u => u.role === "user").length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 使用者列表 */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>使用者列表</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">目前沒有使用者資料</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>姓名</TableHead>
                      <TableHead>電子郵件</TableHead>
                      <TableHead>角色</TableHead>
                      <TableHead>註冊日期</TableHead>
                      <TableHead className="text-right">總工時</TableHead>
                      <TableHead className="text-right">記錄數</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role === "admin" ? "管理員" : "使用者"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), "yyyy/MM/dd", { locale: zhTW })}
                        </TableCell>
                        <TableCell className="text-right">
                          {userStats[user.id]?.totalHours.toFixed(1) || "0.0"} 小時
                        </TableCell>
                        <TableCell className="text-right">
                          {userStats[user.id]?.totalEntries || 0} 筆
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <UserEditDialog 
                              user={user} 
                              onUserUpdated={fetchUsers}
                            />
                            <DeleteUserDialog 
                              user={user} 
                              onUserDeleted={fetchUsers}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}