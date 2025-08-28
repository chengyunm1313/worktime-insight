import AppLayout from "@/components/Layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BarChart3, Users, ArrowRight, TrendingUp, Shield } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Clock,
      title: "工時輸入",
      description: "快速記錄您的工作時間，支援分類和詳細描述",
      href: "/timeentry"
    },
    {
      icon: BarChart3,
      title: "統計分析",
      description: "查看詳細的工時分析報告和趨勢圖表",
      href: "/analytics"
    },
    {
      icon: Users,
      title: "使用者管理",
      description: "管理團隊成員和查看所有使用者的工時統計",
      href: "/users"
    }
  ];

  return (
    <AppLayout currentPath="/">
      <div className="p-6 space-y-8">
        {/* 歡迎區域 */}
        <div className="text-center space-y-4">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg">
            <Clock className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">歡迎使用工時管理系統</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            高效追蹤工作時間，精準分析工作績效，讓時間管理變得更加簡單
          </p>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card 
              key={feature.href} 
              className="shadow-card hover:shadow-hover transition-all duration-300 group cursor-pointer"
              onClick={() => window.location.href = feature.href}
            >
              <CardHeader className="text-center">
                <div className="mx-auto h-16 w-16 rounded-xl bg-gradient-to-br from-primary-light to-primary-light/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">{feature.description}</p>
                <Button 
                  variant="outline" 
                  className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                >
                  開始使用
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 系統優勢 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-accent-light flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground">智能分析</h3>
              </div>
              <p className="text-muted-foreground">
                提供詳細的工時統計和分析報告，幫助您了解工作效率和時間分配
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">安全可靠</h3>
              </div>
              <p className="text-muted-foreground">
                採用先進的權限管理系統，確保每位使用者只能查看和編輯自己的資料
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Supabase 整合提示 */}
        <Card className="shadow-card bg-gradient-to-r from-primary-light/30 to-accent-light/30 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-4">開始使用完整功能</h3>
            <p className="text-muted-foreground mb-6">
              請點擊右上角的 Supabase 按鈕來啟用資料庫和認證功能，即可體驗完整的工時管理系統
            </p>
            <Button className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-md">
              了解更多
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
