import React, { useState } from "react";
import { LogOut, Settings, User, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

const Header = ({
  userName = "Admin User",
  userRole = "System Administrator",
}: HeaderProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-6 w-full">
      <div className="flex-1 flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Faculty Evaluation System
          </h1>
          <p className="text-xs text-muted-foreground">Grade Your Guide</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Settings */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Customize your application preferences
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark theme
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound">Sound Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when notifications arrive
                  </p>
                </div>
                <Switch id="sound" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsSettingsOpen(false)}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 p-1 rounded-full"
            >
              <Avatar>
                <AvatarImage
                  src="/images/logo/grade-your-guide-logo.png"
                  alt={userName}
                />
                <AvatarFallback>
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">{userName}</span>
                <span className="text-xs text-gray-500">{userRole}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-56">
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === "light" ? (
                      <Moon className="mr-2 h-4 w-4" />
                    ) : (
                      <Sun className="mr-2 h-4 w-4" />
                    )}
                    <span>
                      {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>All Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                localStorage.removeItem("isAuthenticated");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dialog */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription>
                View and edit your profile information
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src="/images/logo/grade-your-guide-logo.png"
                  alt={userName}
                />
                <AvatarFallback>
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{userName}</h2>
              <p className="text-gray-500">{userRole}</p>
              <div className="w-full mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm">admin@faculty-eval.edu</p>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <p className="text-sm">Information Technology</p>
                  </div>
                  <div>
                    <Label>Joined</Label>
                    <p className="text-sm">January 15, 2023</p>
                  </div>
                  <div>
                    <Label>Last Login</Label>
                    <p className="text-sm">Today, 10:30 AM</p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                Close
              </Button>
              <Button>Edit Profile</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default Header;
