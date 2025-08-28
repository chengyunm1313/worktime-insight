import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, CalendarIcon, ChevronDown, ChevronRight, Clock, Filter, TrendingUp, PieChart } from "lucide-react";
import { format, subDays, subWeeks, subMonths, subYears, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { zhTW } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { localStorageService, TimeEntry } from '@/lib/localStorageService';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface DateRange {
  from: Date;
  to: Date;
  label: string;
}

interface CategoryStats {
  category: string;
  totalHours: number;
  entries: TimeEntry[];
  subcategories: Record<string, any>;
}

interface ChartData {
  name: string;
  value: number;
  hours: number;
}

// 圖表顏色配置
const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function TimeAnalytics() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("本週");
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        // 管理員可以看到所有工時記錄
        setTimeEntries(localStorageService.getTimeEntries());
      } else {
        // 一般使用者只能看到自己的記錄
        setTimeEntries(localStorageService.getTimeEntriesByUser(user.id));
      }
    }
  }, [user]);

  const getDateRange = (): DateRange => {
    const now = new Date();
    
    switch (selectedPeriod) {
      case "上週":
        const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        return { from: lastWeekStart, to: lastWeekEnd, label: "上週" };
      
      case "本週":
        const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
        const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
        return { from: thisWeekStart, to: thisWeekEnd, label: "本週" };
      
      case "上個月":
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));
        return { from: lastMonthStart, to: lastMonthEnd, label: "上個月" };
      
      case "本月":
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        return { from: thisMonthStart, to: thisMonthEnd, label: "本月" };
      
      case "過去3個月":
        const threeMonthsAgo = subMonths(now, 3);
        return { from: threeMonthsAgo, to: now, label: "過去3個月" };
      
      case "過去半年":
        const sixMonthsAgo = subMonths(now, 6);
        return { from: sixMonthsAgo, to: now, label: "過去半年" };
      
      case "過去一年":
        const oneYearAgo = subYears(now, 1);
        return { from: oneYearAgo, to: now, label: "過去一年" };
      
      case "今年":
        const thisYearStart = startOfYear(now);
        const thisYearEnd = endOfYear(now);
        return { from: thisYearStart, to: thisYearEnd, label: "今年" };
      
      case "去年":
        const lastYearStart = startOfYear(subYears(now, 1));
        const lastYearEnd = endOfYear(subYears(now, 1));
        return { from: lastYearStart, to: lastYearEnd, label: "去年" };
      
      case "自訂範圍":
        if (customDateRange.from && customDateRange.to) {
          return { from: customDateRange.from, to: customDateRange.to, label: "自訂範圍" };
        }
        return { from: startOfWeek(now, { weekStartsOn: 1 }), to: endOfWeek(now, { weekStartsOn: 1 }), label: "本週" };
      
      default:
        return { from: startOfWeek(now, { weekStartsOn: 1 }), to: endOfWeek(now, { weekStartsOn: 1 }), label: "本週" };
    }
  };

  const dateRange = getDateRange();

  // 過濾資料：根據時間範圍
  const filteredEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= dateRange.from && entryDate <= dateRange.to;
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

  // 準備圓餅圖資料
  const pieChartData: ChartData[] = totalHours > 0 ? Object.values(categoryStats).map(cat => ({
    name: cat.category,
    value: Math.round((cat.totalHours / totalHours) * 100 * 10) / 10, // 百分比，保留一位小數
    hours: cat.totalHours
  })) : [];

  // 準備長條圖資料
  const barChartData = Object.values(categoryStats).map(cat => ({
    category: cat.category,
    hours: cat.totalHours,
    entries: cat.entries.length
  }));

  // 準備月度趨勢資料（僅當時間範圍超過一個月時顯示）
  const getMonthlyTrendData = () => {
    const monthlyData: Record<string, number> = {};
    
    filteredEntries.forEach(entry => {
      const monthKey = format(new Date(entry.date), "yyyy-MM");
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += entry.hours;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, hours]) => ({
        month: format(new Date(month + "-01"), "yyyy年MM月"),
        hours: Math.round(hours * 10) / 10
      }));
  };

  const monthlyTrendData = getMonthlyTrendData();
  const showMonthlyTrend = monthlyTrendData.length > 1;

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'hours' ? ' 小時' : entry.dataKey === 'entries' ? ' 筆' : '%'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: payload[0].color }}>
            {`工時: ${data.hours.toFixed(1)} 小時`}
          </p>
          <p style={{ color: payload[0].color }}>
            {`比例: ${data.value}%`}
          </p>
        </div>
      );
    }
    return null;
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
              {user?.role === "admin" ? "查看所有使用者的工時統計" : "查看您的工時統計"}
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
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="pointer-events-auto">
              <SelectItem value="本週">本週</SelectItem>
              <SelectItem value="上週">上週</SelectItem>
              <SelectItem value="本月">本月</SelectItem>
              <SelectItem value="上個月">上個月</SelectItem>
              <SelectItem value="過去3個月">過去3個月</SelectItem>
              <SelectItem value="過去半年">過去半年</SelectItem>
              <SelectItem value="過去一年">過去一年</SelectItem>
              <SelectItem value="今年">今年</SelectItem>
              <SelectItem value="去年">去年</SelectItem>
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
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
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
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
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

      {/* 圖表和詳細資料 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">總覽</TabsTrigger>
          <TabsTrigger value="charts">圖表分析</TabsTrigger>
          <TabsTrigger value="trends">趨勢分析</TabsTrigger>
          <TabsTrigger value="details">詳細資料</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 圓餅圖 */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <span>工時分布</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    選定時間範圍內無工時資料
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 長條圖 */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>類別統計</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {barChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="category" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="hours" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    選定時間範圍內無工時資料
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* 詳細長條圖 */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>工時與記錄數對比</CardTitle>
              </CardHeader>
              <CardContent>
                {barChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="hours" fill="hsl(var(--primary))" name="工時 (小時)" />
                      <Bar yAxisId="right" dataKey="entries" fill="hsl(var(--accent))" name="記錄數 (筆)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    選定時間範圍內無工時資料
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {showMonthlyTrend ? (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>月度工時趨勢</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="hours" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">趨勢分析</h3>
                <p className="text-muted-foreground">
                  請選擇較長的時間範圍（如過去3個月以上）以查看趨勢分析
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
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
              {Object.keys(categoryStats).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  在選定的時間範圍內沒有工時記錄
                </p>
              ) : (
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
                                  {user?.role === "admin" && (
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
                                    {user?.role === "admin" && (
                                      <TableCell className="text-xs text-muted-foreground">
                                        {localStorageService.getUserById(entry.user_id)?.name || "未知使用者"}
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}