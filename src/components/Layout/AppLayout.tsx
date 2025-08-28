import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Clock, BarChart3, Users, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const sidebarItems = [
  {
    title: "工時輸入",
    icon: Clock,
    href: "/timeentry",
  },
  {
    title: "統計分析",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    title: "使用者管理",
    icon: Users,
    href: "/users",
    adminOnly: true,
  },
  {
    title: "設定",
    icon: Settings,
    href: "/settings",
  },
];

interface AppLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export default function AppLayout({ children, currentPath = "/" }: AppLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-secondary">
        <Sidebar className="border-r border-border/50">
          <SidebarHeader className="p-6 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">工時系統</h2>
                <p className="text-sm text-muted-foreground">Time Tracker</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-4 py-6">
            <SidebarMenu>
              {sidebarItems.map((item) => {
                if (item.adminOnly && user?.role !== "admin") return null;
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={currentPath === item.href}
                      className="w-full justify-start space-x-3 h-12 rounded-lg hover:bg-primary-light/50 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground transition-all duration-200"
                    >
                      <Link to={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <div className="p-4 border-t border-border/50 mt-auto">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                <span className="text-sm font-semibold text-accent-foreground">
                  {user?.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start space-x-2 h-10"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span>登出</span>
            </Button>
          </div>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center px-6">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex-1" />
          </header>
          
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}