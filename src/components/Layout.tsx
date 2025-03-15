
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Server, Database, Code2, Home, Menu, X, 
  BarChart3, Settings, Moon, Sun, Power, FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserMenu } from "@/components/UserMenu";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  // Check if path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  };

  // Effect to load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Navigation items
  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { path: "/nginx", label: "Nginx", icon: <Server className="w-5 h-5" /> },
    { path: "/php", label: "PHP", icon: <Code2 className="w-5 h-5" /> },
    { path: "/mysql", label: "MySQL", icon: <Database className="w-5 h-5" /> },
    { path: "/files", label: "File Manager", icon: <FolderOpen className="w-5 h-5" /> },
    { path: "/stats", label: "Statistics", icon: <BarChart3 className="w-5 h-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> }
  ];

  const handleRestart = (service: string) => {
    toast({
      title: `Restarting ${service}`,
      description: `The ${service} service is being restarted...`,
    });
    
    // Simulate service restart
    setTimeout(() => {
      toast({
        title: `${service} Restarted`,
        description: `The ${service} service has been restarted successfully.`,
      });
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-border">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold">HostPanel</h1>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={isActive(item.path) ? "nav-item-active" : "nav-item"}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">System Services</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="status-active"></div>
                <span className="text-sm">Nginx</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRestart("Nginx")}
              >
                <Power className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="status-active"></div>
                <span className="text-sm">PHP-FPM</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleRestart("PHP-FPM")}
              >
                <Power className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="status-active"></div>
                <span className="text-sm">MySQL</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleRestart("MySQL")}
              >
                <Power className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start" 
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-4 h-4 mr-2" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 mr-2" />
                  <span>Light Mode</span>
                </>
              )}
            </Button>
            <UserMenu />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 border-b border-border backdrop-blur-panel py-3 px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold">HostPanel</h1>
          </Link>
          
          <div className="flex items-center gap-2">
            <UserMenu />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-background/95 backdrop-blur-sm animate-fade-in pt-16">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path} className="animate-slide-in">
                  <Link
                    to={item.path}
                    className={isActive(item.path) ? "nav-item-active" : "nav-item"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-border animate-slide-in" style={{ animationDelay: "100ms" }}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">System Services</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="status-active"></div>
                  <span>Nginx</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRestart("Nginx")}
                >
                  <Power className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="status-active"></div>
                  <span>PHP-FPM</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRestart("PHP-FPM")}
                >
                  <Power className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="status-active"></div>
                  <span>MySQL</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRestart("MySQL")}
                >
                  <Power className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col min-h-screen",
        isMobileMenuOpen ? "overflow-hidden h-screen" : ""
      )}>
        <div className="lg:py-8 lg:px-8 py-6 px-4 mt-14 lg:mt-0 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
