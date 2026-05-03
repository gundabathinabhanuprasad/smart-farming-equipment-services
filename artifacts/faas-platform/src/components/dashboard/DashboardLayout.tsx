import { type ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tractor, LayoutDashboard, Users, CalendarCheck, LogOut,
  Wrench, Car, ChevronRight, Menu, X
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  tab: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  title: string;
  role: string;
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  owner: "bg-blue-100 text-blue-800",
  driver: "bg-green-100 text-green-800",
  farmer: "bg-amber-100 text-amber-800",
};

export function DashboardLayout({ title, role, navItems, activeTab, onTabChange, children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static z-30 h-full w-64 bg-card border-r flex flex-col transition-transform duration-200 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-5 border-b">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary p-1.5 rounded-md">
              <Tractor className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-serif font-bold text-xl text-primary">KhetBook</span>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground text-sm">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.phone}</p>
            {user?.village && <p className="text-xs text-muted-foreground">{user.village}, {user.state}</p>}
            <Badge className={`text-xs mt-1 ${roleColors[role] ?? "bg-muted text-muted-foreground"}`}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.tab}
              onClick={() => { onTabChange(item.tab); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                activeTab === item.tab
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {activeTab === item.tab && <ChevronRight className="h-3 w-3 ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setLocation("/")}>
            <Tractor className="h-4 w-4 mr-2" />
            Back to Site
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-card border-b px-4 md:px-6 h-14 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 rounded-md hover:bg-muted" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="font-bold text-lg text-foreground">{title}</h1>
          </div>
          <div className="text-sm text-muted-foreground hidden md:block">
            {navItems.find(n => n.tab === activeTab)?.label}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export { LayoutDashboard, Users, CalendarCheck, Wrench, Car };
