import { useState } from "react";
import { 
  Server, FileCode, RefreshCcw, Save, 
  PlayCircle, StopCircle, PlusCircle, Globe,
  Trash2, ClipboardEdit, ExternalLink, 
  Package, Download
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";

// Mock data for virtual hosts
const initialVirtualHosts = [
  {
    id: 1,
    domain: "example.com",
    root: "/var/www/example.com",
    status: "active",
    ssl: true,
    sslExpiry: "2024-05-15"
  },
  {
    id: 2,
    domain: "blog.example.com",
    root: "/var/www/blog.example.com",
    status: "active",
    ssl: true,
    sslExpiry: "2024-06-22"
  },
  {
    id: 3,
    domain: "test.example.com",
    root: "/var/www/test.example.com",
    status: "inactive",
    ssl: false,
    sslExpiry: null
  },
];

// Mock Nginx configuration
const initialNginxConfig = `# /etc/nginx/nginx.conf
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 768;
    # multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    # server_tokens off;

    # server_names_hash_bucket_size 64;
    # server_name_in_redirect off;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Logging Settings
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip Settings
    gzip on;

    # Virtual Host Configs
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}`;

// Mock data for Nginx modules
const initialModules = [
  {
    id: 1,
    name: "ngx_http_gzip_module",
    description: "Compresses responses using the gzip method to reduce the size of transmitted data",
    status: "active",
    version: "1.22.1"
  },
  {
    id: 2,
    name: "ngx_http_ssl_module",
    description: "Provides the necessary support for HTTPS",
    status: "active",
    version: "1.22.1"
  },
  {
    id: 3,
    name: "ngx_http_rewrite_module",
    description: "Changes request URI using regular expressions",
    status: "active",
    version: "1.22.1"
  },
  {
    id: 4,
    name: "ngx_http_proxy_module",
    description: "Passes requests to another server",
    status: "active",
    version: "1.22.1"
  },
  {
    id: 5,
    name: "ngx_http_fastcgi_module",
    description: "Passes requests to a FastCGI server",
    status: "inactive",
    version: "1.22.1"
  }
];

const Nginx = () => {
  const [nginxConfig, setNginxConfig] = useState(initialNginxConfig);
  const [virtualHosts, setVirtualHosts] = useState(initialVirtualHosts);
  const [modules, setModules] = useState(initialModules);
  const [newDomain, setNewDomain] = useState("");
  const [newPath, setNewPath] = useState("/var/www/");
  const [serviceStatus, setServiceStatus] = useState<"active" | "inactive">("active");
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [newModuleName, setNewModuleName] = useState("");
  const { toast } = useToast();

  // Handler to save Nginx configuration
  const handleSaveConfig = () => {
    toast({
      title: "Configuration Saved",
      description: "Nginx configuration has been saved successfully."
    });
  };

  // Handler to restart Nginx
  const handleRestartNginx = () => {
    toast({
      title: "Restarting Nginx",
      description: "Nginx service is being restarted..."
    });
    
    // Simulate service restart
    setTimeout(() => {
      toast({
        title: "Nginx Restarted",
        description: "Nginx service has been restarted successfully."
      });
    }, 2000);
  };

  // Handler to toggle Nginx service status
  const toggleServiceStatus = () => {
    const newStatus = serviceStatus === "active" ? "inactive" : "active";
    
    toast({
      title: serviceStatus === "active" ? "Stopping Nginx" : "Starting Nginx",
      description: serviceStatus === "active" 
        ? "Nginx service is being stopped..." 
        : "Nginx service is being started..."
    });
    
    // Simulate status change
    setTimeout(() => {
      setServiceStatus(newStatus);
      toast({
        title: serviceStatus === "active" ? "Nginx Stopped" : "Nginx Started",
        description: serviceStatus === "active" 
          ? "Nginx service has been stopped successfully." 
          : "Nginx service has been started successfully."
      });
    }, 1500);
  };

  // Handler to add new virtual host
  const handleAddVirtualHost = () => {
    if (!newDomain) {
      toast({
        title: "Error",
        description: "Domain name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!newPath) {
      toast({
        title: "Error",
        description: "Document root path is required.",
        variant: "destructive"
      });
      return;
    }

    const newVirtualHost = {
      id: virtualHosts.length + 1,
      domain: newDomain,
      root: newPath,
      status: "inactive" as const,
      ssl: false,
      sslExpiry: null
    };

    setVirtualHosts([...virtualHosts, newVirtualHost]);
    setNewDomain("");
    setNewPath("/var/www/");

    toast({
      title: "Virtual Host Added",
      description: `Virtual host for ${newDomain} has been added successfully.`
    });
  };

  // Handler to toggle virtual host status
  const toggleVirtualHostStatus = (id: number) => {
    setVirtualHosts(virtualHosts.map(host => {
      if (host.id === id) {
        const newStatus = host.status === "active" ? "inactive" : "active";
        
        toast({
          title: host.status === "active" ? "Disabling Site" : "Enabling Site",
          description: `${host.domain} is being ${host.status === "active" ? "disabled" : "enabled"}...`
        });
        
        return { ...host, status: newStatus };
      }
      return host;
    }));
  };

  // Handler to delete virtual host
  const handleDeleteVirtualHost = (id: number, domain: string) => {
    toast({
      title: "Deleting Virtual Host",
      description: `Virtual host for ${domain} is being deleted...`
    });
    
    // Simulate deletion
    setTimeout(() => {
      setVirtualHosts(virtualHosts.filter(host => host.id !== id));
      toast({
        title: "Virtual Host Deleted",
        description: `Virtual host for ${domain} has been deleted successfully.`
      });
    }, 1000);
  };

  // Handler to install a new module
  const handleInstallModule = () => {
    if (!newModuleName) {
      toast({
        title: "Error",
        description: "Module name is required.",
        variant: "destructive"
      });
      return;
    }

    setIsInstalling(true);
    
    // Simulate installation progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setInstallProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Add the new module to the list
        const newModule = {
          id: modules.length + 1,
          name: newModuleName,
          description: "Custom Nginx module",
          status: "inactive" as const,
          version: "1.22.1"
        };
        
        setModules([...modules, newModule]);
        setNewModuleName("");
        setIsInstalling(false);
        setInstallProgress(0);
        
        toast({
          title: "Module Installed",
          description: `Module ${newModuleName} has been installed successfully.`
        });
      }
    }, 500);
  };

  // Handler to toggle module status
  const toggleModuleStatus = (id: number) => {
    setModules(modules.map(module => {
      if (module.id === id) {
        const newStatus = module.status === "active" ? "inactive" : "active";
        
        toast({
          title: module.status === "active" ? "Disabling Module" : "Enabling Module",
          description: `${module.name} is being ${module.status === "active" ? "disabled" : "enabled"}...`
        });
        
        return { ...module, status: newStatus };
      }
      return module;
    }));
  };

  // Handler to delete a module
  const handleDeleteModule = (id: number, name: string) => {
    toast({
      title: "Deleting Module",
      description: `Module ${name} is being deleted...`
    });
    
    // Simulate deletion
    setTimeout(() => {
      setModules(modules.filter(module => module.id !== id));
      toast({
        title: "Module Deleted",
        description: `Module ${name} has been deleted successfully.`
      });
    }, 1000);
  };

  return (
    <Layout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Server className="w-5 h-5 text-green-700 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Nginx Server</h1>
              <p className="text-muted-foreground">Manage your web server configuration</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant={serviceStatus === "active" ? "destructive" : "default"}
              className="flex items-center gap-2 smooth-transition flex-1 sm:flex-auto"
              onClick={toggleServiceStatus}
            >
              {serviceStatus === "active" ? (
                <>
                  <StopCircle className="w-4 h-4" />
                  Stop Service
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  Start Service
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 smooth-transition flex-1 sm:flex-auto"
              onClick={handleRestartNginx}
            >
              <RefreshCcw className="w-4 h-4" />
              Restart
            </Button>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="mt-6 glass-panel p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-3 w-3 rounded-full",
              serviceStatus === "active" ? "bg-green-500 animate-pulse" : "bg-red-500"
            )}></div>
            <div>
              <p className="font-medium">Service Status: {serviceStatus === "active" ? "Running" : "Stopped"}</p>
              <p className="text-sm text-muted-foreground">Version: nginx/1.22.1</p>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <p className="text-sm text-muted-foreground">Process ID</p>
            <p className="font-mono">{serviceStatus === "active" ? "1234" : "N/A"}</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs defaultValue="virtual-hosts">
          <TabsList className="mb-6">
            <TabsTrigger value="virtual-hosts" className="gap-2">
              <Globe className="w-4 h-4" />
              Virtual Hosts
            </TabsTrigger>
            <TabsTrigger value="modules" className="gap-2">
              <Package className="w-4 h-4" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="configuration" className="gap-2">
              <FileCode className="w-4 h-4" />
              Configuration
            </TabsTrigger>
          </TabsList>
          
          {/* Virtual Hosts Tab */}
          <TabsContent value="virtual-hosts" className="space-y-6">
            {/* Virtual Hosts List */}
            <Card>
              <CardHeader>
                <CardTitle>Virtual Hosts</CardTitle>
                <CardDescription>Manage your Nginx virtual hosts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead>Document Root</TableHead>
                      <TableHead>SSL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {virtualHosts.map((host) => (
                      <TableRow key={host.id}>
                        <TableCell className="font-medium">{host.domain}</TableCell>
                        <TableCell className="font-mono text-sm">{host.root}</TableCell>
                        <TableCell>
                          {host.ssl ? (
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                              <span className="text-sm">Valid until {host.sslExpiry}</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-gray-300 mr-2"></div>
                              <span className="text-sm">Not enabled</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium inline-block",
                            host.status === "active" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                          )}>
                            {host.status === "active" ? "Enabled" : "Disabled"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleVirtualHostStatus(host.id)}
                              title={host.status === "active" ? "Disable" : "Enable"}
                            >
                              {host.status === "active" ? (
                                <StopCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <PlayCircle className="w-4 h-4 text-green-500" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit"
                            >
                              <ClipboardEdit className="w-4 h-4 text-blue-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Open in browser"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteVirtualHost(host.id, host.domain)}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Add New Virtual Host */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Virtual Host</CardTitle>
                <CardDescription>Create a new Nginx virtual host configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="domain">Domain Name</Label>
                      <Input 
                        id="domain" 
                        placeholder="example.com" 
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="root">Document Root</Label>
                      <Input 
                        id="root" 
                        placeholder="/var/www/example.com" 
                        value={newPath}
                        onChange={(e) => setNewPath(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={handleAddVirtualHost}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Virtual Host
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Quick Template</Label>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 text-sm font-mono overflow-x-auto text-gray-700 dark:text-gray-300">
                      <pre className="whitespace-pre-wrap">
{`server {
    listen 80;
    server_name ${newDomain || 'example.com'};
    root ${newPath || '/var/www/example.com'};
    
    index index.html index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \\.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            {/* Modules List */}
            <Card>
              <CardHeader>
                <CardTitle>Nginx Modules</CardTitle>
                <CardDescription>Manage your Nginx modules</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell className="font-medium font-mono">{module.name}</TableCell>
                        <TableCell>{module.description}</TableCell>
                        <TableCell>{module.version}</TableCell>
                        <TableCell>
                          <div className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium inline-block",
                            module.status === "active" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                          )}>
                            {module.status === "active" ? "Enabled" : "Disabled"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleModuleStatus(module.id)}
                              title={module.status === "active" ? "Disable" : "Enable"}
                            >
                              {module.status === "active" ? (
                                <StopCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <PlayCircle className="w-4 h-4 text-green-500" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteModule(module.id, module.name)}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Install New Module */}
            <Card>
              <CardHeader>
                <CardTitle>Install New Module</CardTitle>
                <CardDescription>Install additional Nginx modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="moduleName">Module Name</Label>
                      <Input 
                        id="moduleName" 
                        placeholder="ngx_http_module_name" 
                        value={newModuleName}
                        onChange={(e) => setNewModuleName(e.target.value)}
                        disabled={isInstalling}
                      />
                    </div>
                    
                    {isInstalling && (
                      <div className="space-y-2">
                        <Label>Installation Progress</Label>
                        <Progress value={installProgress} className="h-2" />
                        <p className="text-sm text-muted-foreground text-right">{installProgress}%</p>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full"
                      onClick={handleInstallModule}
                      disabled={isInstalling || !newModuleName}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isInstalling ? "Installing..." : "Install Module"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Configuration Tab */}
          <TabsContent value="configuration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-primary" />
                  Nginx Configuration
                </CardTitle>
                <CardDescription>Edit your main nginx.conf file</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea 
                    className="font-mono h-[500px] resize-none"
                    value={nginxConfig}
                    onChange={(e) => setNginxConfig(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleRestartNginx}>
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Test Configuration
                </Button>
                <Button onClick={handleSaveConfig}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Nginx;
