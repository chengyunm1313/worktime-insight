import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BarChart3, CalendarIcon, ChevronDown, ChevronRight, Clock, Filter, TrendingUp } from "lucide-react";
import { format, subDays, subWeeks, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { zhTW } from "date-fns/locale";
import { cn } from "@/lib/utils";

// 模擬數據 - 實際應用中會從 Supabase 獲取
const mockTimeEntries = [
  {
    id: "1",
    date: "2024-01-15",
    category: "開發工作",
    subcategory: "前端開發",
    description: "完成使用者介面設計",
    hours: 8.0,
    user: "張小明"
  },
  {
    id: "2", 
    date: "2024-01-15",
    category: "專案管理",
    subcategory: "需求分析",
    description: "分析客戶需求文件",
    hours: 4.5,
    user: "張小明"
  },
  {
    id: "3",
    date: "2024-01-16",
    category: "開發工作", 
    subcategory: "後端開發",
    description: "API 開發和測試",
    hours: 7.5,
    user: "張小明"
  },
  {
    id: "4",
    date: "2024-01-16",
    category: "休假",
    subcategory: "年假",
    description: "年假休息",
    hours: 8.0,
    user: "李小華"
  }
];

interface DateRange {
  from: Date;
  to: Date;
  label: string;
}

interface CategoryStats {
  category: string;
  totalHours: number;
  entries: any[];
  subcategories: Record<string, any>;
}

export default function TimeAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("本週");
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showCustomDate, setShowCustomDate] = useState(false);

  // 模擬當前使用者
  const currentUser = { name: "張小明", role: "admin" }; // 或 "user"

  const getDateRange = (): DateRange => {
    const now = new Date();
    
    switch (selectedPeriod) {
      case "上週":
        const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        return {
          from: lastWeekStart,
          to: lastWeekEnd,
          label: "上週"
        };
      case "本週":
        const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
        const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
        return {
          from: thisWeekStart,
          to: thisWeekEnd,
          label: "本週"
        };
      case "上個月":
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));
        return {
          from: lastMonthStart,
          to: lastMonthEnd,
          label: "上個月"
        };
      case "本月":
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        return {
          from: thisMonthStart,
          to: thisMonthEnd,
          label: "本月"
        };
      case "自訂範圍":
        if (customDateRange.from && customDateRange.to) {
          return {
            from: customDateRange.from,
            to: customDateRange.to,
            label: "自訂範圍"
          };
        }
        return {
          from: thisWeekStart,
          to: thisWeekEnd,
          label: "本週"
        };
      default:
        return {
          from: startOfWeek(now, { weekStartsOn: 1 }),
          to: endOfWeek(now, { weekStartsOn: 1 }),
          label: "本週"
        };
    }
  };

  const dateRange = getDateRange();

  // 過濾資料：根據使用者角色和時間範圍
  const filteredEntries = mockTimeEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const inDateRange = entryDate >= dateRange.from && entryDate <= dateRange.to;
    
    if (currentUser.role === "admin") {
      return inDateRange; // 管理員可看所有人
    } else {
      return inDateRange && entry.user === currentUser.name; // 一般使用者只看自己
    }
  });

  // 統計資料
  const categoryStats = filteredEntries.reduce((acc, entry) => {
    const key = entry.category;
    if (!acc[key]) {
      acc[key] = { 
        category: key, 
        totalHours: 0, 
        entries: [],
        subcategories: {} 
      };
    }
    acc[key].totalHours += entry.hours;
    acc[key].entries.push(entry);
    
    // 次類別統計
    if (!acc[key].subcategories[entry.subcategory]) {
      acc[key].subcategories[entry.subcategory] = {
        subcategory: entry.subcategory,
        hours: 0,
        entries: []
      };
    }
    acc[key].subcategories[entry.subcategory].hours += entry.hours;
    acc[key].subcategories[entry.subcategory].entries.push(entry);
    
    return acc;
  }, {} as Record<string, CategoryStats>);

  const totalHours = Object.values(categoryStats).reduce((sum: number, cat: CategoryStats) => sum + cat.totalHours, 0);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "開發工作": "chart-1",
      "專案管理": "chart-2", 
      "客戶服務": "chart-3",
      "行政事務": "chart-4",
      "休假": "chart-5"
    };
    return colors[category as keyof typeof colors] || "chart-1";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">工時統計分析</h1>
            <p className="text-muted-foreground">
              {currentUser.role === "admin" ? "查看所有使用者的工時統計" : "查看您的工時統計"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Select 
            value={selectedPeriod} 
            onValueChange={(value) => {
              setSelectedPeriod(value);
              setShowCustomDate(value === "自訂範圍");
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="pointer-events-auto">
              <SelectItem value="本週">本週</SelectItem>
              <SelectItem value="上週">上週</SelectItem>
              <SelectItem value="本月">本月</SelectItem>
              <SelectItem value="上個月">上個月</SelectItem>
              <SelectItem value="自訂範圍">自訂範圍</SelectItem>
            </SelectContent>
          </Select>

          {showCustomDate && (
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customDateRange.from ? format(customDateRange.from, "MM/dd", { locale: zhTW }) : "開始日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customDateRange.from}
                    onSelect={(date) => setCustomDateRange(prev => ({ ...prev, from: date }))}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customDateRange.to ? format(customDateRange.to, "MM/dd", { locale: zhTW }) : "結束日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customDateRange.to}
                    onSelect={(date) => setCustomDateRange(prev => ({ ...prev, to: date }))}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>

      {/* 總覽卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">總工時</p>
                <p className="text-3xl font-bold text-primary">{totalHours.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground mt-1">小時</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary-light flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">工作天數</p>
                <p className="text-3xl font-bold text-accent">
                  {new Set(filteredEntries.map(e => e.date)).size}
                </p>
                <p className="text-xs text-muted-foreground mt-1">天</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent-light flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">日均工時</p>
                <p className="text-3xl font-bold text-warning">
                  {new Set(filteredEntries.map(e => e.date)).size > 0 
                    ? (totalHours / new Set(filteredEntries.map(e => e.date)).size).toFixed(1)
                    : "0.0"
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-1">小時/天</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Filter className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 分類統計表 */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>工時分類統計</span>
            <Badge variant="secondary" className="ml-auto">
              {format(dateRange.from, "MM/dd", { locale: zhTW })} - {format(dateRange.to, "MM/dd", { locale: zhTW })}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.values(categoryStats).map((catData: any) => (
              <Collapsible key={catData.category}>
                <CollapsibleTrigger 
                  className="w-full p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  onClick={() => toggleCategory(catData.category)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {expandedCategories.has(catData.category) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div 
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: catData.category === "開發工作" ? "hsl(var(--chart-1))" :
                                          catData.category === "專案管理" ? "hsl(var(--chart-2))" :
                                          catData.category === "客戶服務" ? "hsl(var(--chart-3))" :
                                          catData.category === "行政事務" ? "hsl(var(--chart-4))" :
                                          "hsl(var(--chart-5))"
                        }}
                      ></div>
                      <span className="font-medium text-foreground">{catData.category}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">
                        {catData.entries.length} 筆記錄
                      </span>
                      <span className="font-semibold text-primary">
                        {catData.totalHours.toFixed(1)} 小時
                      </span>
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="mt-3 ml-8 space-y-3">
                    {/* 次類別統計 */}
                    {Object.values(catData.subcategories).map((subData: any) => (
                      <div key={subData.subcategory} className="p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-foreground">{subData.subcategory}</span>
                          <span className="text-sm font-semibold text-primary">
                            {subData.hours.toFixed(1)} 小時
                          </span>
                        </div>
                        
                        {/* 明細表 */}
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="h-8 text-xs">日期</TableHead>
                              <TableHead className="h-8 text-xs">工作內容</TableHead>
                              {currentUser.role === "admin" && (
                                <TableHead className="h-8 text-xs">員工</TableHead>
                              )}
                              <TableHead className="h-8 text-xs text-right">工時</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {subData.entries.map((entry: any) => (
                              <TableRow key={entry.id} className="h-10">
                                <TableCell className="text-xs text-muted-foreground">
                                  {format(new Date(entry.date), "MM/dd", { locale: zhTW })}
                                </TableCell>
                                <TableCell className="text-xs">
                                  {entry.description}
                                </TableCell>
                                {currentUser.role === "admin" && (
                                  <TableCell className="text-xs text-muted-foreground">
                                    {entry.user}
                                  </TableCell>
                                )}
                                <TableCell className="text-xs text-right font-medium">
                                  {entry.hours.toFixed(1)}h
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}