
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Server, Database, Code2, Home, BarChart3, Settings, 
  Moon, Sun, Power, FolderOpen, User, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const location = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  const { toast } = useToast();
  const { state } = useSidebar();

  const isActive = (path: string) => location.pathname === path;

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/nginx", label: "Nginx", icon: Server },
    { path: "/php", label: "PHP", icon: Code2 },
    { path: "/mysql", label: "MySQL", icon: Database },
    { path: "/files", label: "File Manager", icon: FolderOpen },
    { path: "/stats", label: "Statistics", icon: BarChart3 },
    { path: "/settings", label: "Settings", icon: Settings }
  ];

  const handleRestart = (service: string) => {
    toast({
      title: `Restarting ${service}`,
      description: `The ${service} service is being restarted...`,
    });
    
    setTimeout(() => {
      toast({
        title: `${service} Restarted`,
        description: `The ${service} service has been restarted successfully.`,
      });
    }, 2000);
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <Sidebar className="border-r flex flex-col">
      <SidebarHeader className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Server className="w-5 h-5 text-white" />
          </div>
          {state === "expanded" && <h1 className="text-xl font-semibold">SLEMP Panel</h1>}
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link to={item.path}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Fixed Bottom Section */}
      <div className="mt-auto border-t bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel>System Services</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3 px-2 py-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {state === "expanded" && <span className="text-sm">Nginx</span>}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRestart("Nginx")}
                  className="h-6 w-6 p-0"
                >
                  <Power className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {state === "expanded" && <span className="text-sm">PHP-FPM</span>}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRestart("PHP-FPM")}
                  className="h-6 w-6 p-0"
                >
                  <Power className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {state === "expanded" && <span className="text-sm">MySQL</span>}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRestart("MySQL")}
                  className="h-6 w-6 p-0"
                >
                  <Power className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarFooter className="p-4">
          {/* Inline Mode and Admin Buttons */}
          <div className="flex gap-2">
            {/* Mode Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 justify-start" 
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-4 h-4" />
                  {state === "expanded" && <span className="ml-2">Dark</span>}
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  {state === "expanded" && <span className="ml-2">Light</span>}
                </>
              )}
            </Button>

            {/* Admin Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex-1 justify-start">
                  <User className="w-4 h-4" />
                  {state === "expanded" && <span className="ml-2">admin</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
