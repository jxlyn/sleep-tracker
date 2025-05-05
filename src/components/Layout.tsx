import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  LogOut,
  Clock,
  Moon,
  AlarmClock,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth.tsx";

interface LayoutProps {
  children: React.ReactNode;
}

function SidebarNav({ navItems, isActive }) {
  const sidebar = useSidebar();
  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex items-center px-3 py-2 rounded-md transition-colors",
            isActive(item.path)
              ? "bg-primary text-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          )}
          onClick={() => {
            if (sidebar?.isMobile) sidebar.setOpenMobile(false);
          }}
        >
          {item.icon}
          <span className="ml-3">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path
  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Clock className="w-5 h-5" /> },
    { name: "Log Sleep", path: "/log", icon: <Moon className="w-5 h-5" /> },
    { name: "Assessment", path: "/assessment", icon: <AlarmClock className="w-5 h-5" /> },
    { name: "Profile", path: "/profile", icon: <User className="w-5 h-5" /> },
  ]

  return (
    <SidebarProvider defaultOpen={false}>
      {/* Header Bar - Always Visible */}
      <div className="fixed top-0 left-0 z-50 w-full px-4 py-4 flex items-center gap-2 bg-background/80 backdrop-blur-md">
        <SidebarTrigger />
        <h1 className="text-xl font-bold bg-gradient-to-r from-sleep-medium to-sleep-darkBlue bg-clip-text text-transparent">
          SlumberGlow
        </h1>
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex w-full">
        <Sidebar className="pt-[64px] px-4">
          <SidebarNav navItems={navItems} isActive={isActive} />
          <div className="mt-auto border-t border-border pt-4">
            <Button
              onClick={handleSignOut}
              className="w-full flex items-center justify-start text-destructive hover:bg-destructive/10"
              variant="ghost"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Sign Out</span>
            </Button>
          </div>
        </Sidebar>
        <SidebarInset className="w-full px-0">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default Layout;
