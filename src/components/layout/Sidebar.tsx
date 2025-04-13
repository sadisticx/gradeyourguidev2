import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  FileText,
  Send,
  BarChart3,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BookOpen,
} from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const NavItem = ({
  icon,
  label,
  path,
  isActive,
  isCollapsed,
}: NavItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={path}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3 py-2",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
                isCollapsed ? "h-10 w-10 justify-center p-0" : "h-10",
              )}
            >
              {icon}
              {!isCollapsed && <span>{label}</span>}
            </Button>
          </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: <FileText size={20} />,
      label: "Questionnaires",
      path: "/questionnaires",
    },
    {
      icon: <Send size={20} />,
      label: "Form Distribution",
      path: "/forms",
    },
    {
      icon: <BookOpen size={20} />,
      label: "Sections & Instructors",
      path: "/sections",
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Analytics",
      path: "/analytics",
    },
    {
      icon: <Users size={20} />,
      label: "Admin Management",
      path: "/admins",
    },
  ];

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-background border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <div className="font-semibold text-lg">Faculty Evaluation</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-4 px-2">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={currentPath === item.path}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>

      <div className="border-t p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3 py-2 text-muted-foreground",
                  isCollapsed ? "h-10 w-10 justify-center p-0" : "h-10",
                )}
                onClick={() => {
                  localStorage.removeItem("isAuthenticated");
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
              >
                <LogOut size={20} />
                {!isCollapsed && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Logout</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;
