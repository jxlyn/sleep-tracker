
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  AlarmClock, 
  Moon, 
  Calendar, 
  Clock, 
  User,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: <Clock className="w-5 h-5" /> },
    { name: "Log Sleep", path: "/log", icon: <Moon className="w-5 h-5" /> },
    { name: "Assessment", path: "/assessment", icon: <AlarmClock className="w-5 h-5" /> },
    { name: "Summary", path: "/summary", icon: <Calendar className="w-5 h-5" /> },
    { name: "Profile", path: "/profile", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar border-r border-border transition-all duration-300 z-10",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo area */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="font-bold text-xl bg-gradient-to-r from-sleep-medium to-sleep-darkBlue bg-clip-text text-transparent">
                SlumberGlow
              </h1>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Nav links */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg transition-colors",
                  isActivePath(item.path) 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-sidebar-accent text-sidebar-foreground"
                )}
              >
                <span className="flex items-center justify-center">{item.icon}</span>
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-border">
            {sidebarOpen && (
              <div className="text-xs text-muted-foreground">
                Sweet dreams await
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div 
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
