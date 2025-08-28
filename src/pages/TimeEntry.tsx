import { useState, useEffect } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import TimeEntryForm from "@/components/TimeEntry/TimeEntryForm";
import { useAuth } from '@/contexts/AuthContext';
import { localStorageService, TimeEntry } from '@/lib/localStorageService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function TimeEntry() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  const fetchTimeEntries = () => {
    if (!user) return;
    const entries = localStorageService.getTimeEntriesByUser(user.id);
    // 按日期和創建時間排序
    entries.sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare === 0) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return dateCompare;
    });
    setTimeEntries(entries);
  };

  useEffect(() => {
    fetchTimeEntries();
  }, [user]);

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('確定要刪除這筆工時記錄嗎？')) {
      const success = localStorageService.deleteTimeEntry(id);
      if (success) {
        fetchTimeEntries(); // 重新載入資料
        toast({
          title: "刪除成功",
          description: "工時記錄已刪除",
        });
      } else {
        toast({
          title: "刪除失敗",
          description: "無法刪除工時記錄",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveSuccess = () => {
    setEditingEntry(null);
    fetchTimeEntries(); // 重新載入資料
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  return (
    <AppLayout currentPath="/timeentry">
      <div className="p-6 space-y-6">
        <TimeEntryForm 
          initialEntry={editingEntry}
          onSaveSuccess={handleSaveSuccess}
          onCancelEdit={handleCancelEdit}
        />

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>我的工時記錄</CardTitle>
          </CardHeader>
          <CardContent>
            {timeEntries.length === 0 ? (
              <p className="text-muted-foreground">目前沒有工時記錄。</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>日期</TableHead>
                      <TableHead>時間</TableHead>
                      <TableHead>類別</TableHead>
                      <TableHead>次類別</TableHead>
                      <TableHead>描述</TableHead>
                      <TableHead className="text-right">工時</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{format(new Date(entry.date), "yyyy/MM/dd", { locale: zhTW })}</TableCell>
                        <TableCell>{entry.startTime} - {entry.endTime}</TableCell>
                        <TableCell>{entry.category}</TableCell>
                        <TableCell>{entry.subcategory}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{entry.description}</TableCell>
                        <TableCell className="text-right">{entry.hours.toFixed(1)}h</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(entry)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(entry.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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