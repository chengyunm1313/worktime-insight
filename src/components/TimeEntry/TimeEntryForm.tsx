import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Clock } from "lucide-react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { localStorageService, TimeEntry } from '@/lib/localStorageService';

// 工作類別配置
const workCategories = {
  "開發工作": ["前端開發", "後端開發", "資料庫設計", "系統測試", "程式碼審查"],
  "專案管理": ["需求分析", "進度追蹤", "會議協調", "文件整理", "風險評估"],
  "客戶服務": ["客戶諮詢", "問題解決", "技術支援", "產品演示", "培訓服務"],
  "行政事務": ["文件處理", "報告撰寫", "資料整理", "會議記錄", "其他行政"],
  "休假": ["年假", "病假", "事假", "特休", "補休"]
};

interface TimeEntryFormProps {
  initialEntry?: TimeEntry;
  onSaveSuccess?: () => void;
  onCancelEdit?: () => void;
}

export default function TimeEntryForm({ initialEntry, onSaveSuccess, onCancelEdit }: TimeEntryFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialEntry) {
      setDate(new Date(initialEntry.date));
      setStartTime(initialEntry.startTime);
      setEndTime(initialEntry.endTime);
      setCategory(initialEntry.category);
      setSubcategory(initialEntry.subcategory);
      setDescription(initialEntry.description);
    } else {
      // 重置表單
      setDate(new Date());
      setStartTime("");
      setEndTime("");
      setCategory("");
      setSubcategory("");
      setDescription("");
    }
  }, [initialEntry]);

  const calculateHours = (start: string, end: string): number => {
    if (!start || !end) return 0;
    
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    
    if (endTime <= startTime) return 0;
    
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  };

  const hours = calculateHours(startTime, endTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "未登入",
        description: "請先登入才能記錄工時",
        variant: "destructive",
      });
      return;
    }

    if (!date || !startTime || !endTime || !category || !subcategory || !description.trim()) {
      toast({
        title: "請填寫所有必要欄位",
        description: "請確保所有欄位都已正確填寫",
        variant: "destructive",
      });
      return;
    }

    if (hours <= 0) {
      toast({
        title: "時間設定錯誤",
        description: "結束時間必須晚於開始時間",
        variant: "destructive",
      });
      return;
    }

    const timeEntryData = {
      date: format(date, 'yyyy-MM-dd'),
      startTime,
      endTime,
      category,
      subcategory,
      description,
      hours,
      user_id: user.id,
    };

    try {
      if (initialEntry?.id) {
        // 更新現有記錄
        const updatedEntry = localStorageService.updateTimeEntry(initialEntry.id, timeEntryData);
        if (updatedEntry) {
          toast({
            title: "工時記錄已更新",
            description: `成功更新 ${hours.toFixed(1)} 小時的工作時間`,
          });
        } else {
          throw new Error("更新失敗");
        }
      } else {
        // 新增記錄
        localStorageService.saveTimeEntry(timeEntryData);
        toast({
          title: "工時記錄已儲存",
          description: `成功記錄 ${hours.toFixed(1)} 小時的工作時間`,
        });
      }

      // 呼叫成功回調
      if (onSaveSuccess) {
        onSaveSuccess();
      } else {
        // 重置表單
        setStartTime("");
        setEndTime("");
        setCategory("");
        setSubcategory("");
        setDescription("");
      }
    } catch (error) {
      toast({
        title: "儲存失敗",
        description: "工時記錄儲存失敗，請重試",
        variant: "destructive",
      });
    }
  };

  const availableSubcategories = category ? workCategories[category as keyof typeof workCategories] || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
          <Plus className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{initialEntry ? "編輯工時記錄" : "工時輸入"}</h1>
          <p className="text-muted-foreground">記錄您的工作時間和內容</p>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>{initialEntry ? "編輯現有記錄" : "新增工時記錄"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 日期選擇 */}
              <div className="space-y-2">
                <Label htmlFor="date">工作日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "yyyy年MM月dd日", { locale: zhTW }) : "選擇日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* 工時計算顯示 */}
              <div className="space-y-2">
                <Label>總工時</Label>
                <div className="h-10 px-3 py-2 border border-input rounded-md bg-muted/50 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-semibold text-primary">
                    {hours > 0 ? `${hours.toFixed(1)} 小時` : "0 小時"}
                  </span>
                </div>
              </div>

              {/* 開始時間 */}
              <div className="space-y-2">
                <Label htmlFor="startTime">開始時間</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* 結束時間 */}
              <div className="space-y-2">
                <Label htmlFor="endTime">結束時間</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* 大類別 */}
              <div className="space-y-2">
                <Label htmlFor="category">工作大類</Label>
                <Select value={category} onValueChange={(value) => {
                  setCategory(value);
                  setSubcategory(""); // 重置次類別
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇工作類別" />
                  </SelectTrigger>
                  <SelectContent className="pointer-events-auto">
                    {Object.keys(workCategories).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 次類別 */}
              <div className="space-y-2">
                <Label htmlFor="subcategory">工作次類</Label>
                <Select 
                  value={subcategory} 
                  onValueChange={setSubcategory}
                  disabled={!category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={category ? "選擇細項類別" : "請先選擇大類"} />
                  </SelectTrigger>
                  <SelectContent className="pointer-events-auto">
                    {availableSubcategories.map((subcat) => (
                      <SelectItem key={subcat} value={subcat}>
                        {subcat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 工作描述 */}
            <div className="space-y-2">
              <Label htmlFor="description">工作內容描述</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="詳細描述您的工作內容..."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* 提交按鈕 */}
            <div className="flex justify-end space-x-3">
              {initialEntry && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onCancelEdit}
                >
                  取消編輯
                </Button>
              )}
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-md"
              >
                {initialEntry ? "更新工時記錄" : "儲存工時記錄"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}