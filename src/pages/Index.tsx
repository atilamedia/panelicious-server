import React, { useState, useEffect } from "react";
import { 
  Server, Database, Code2, ArrowRight, PlusCircle, 
  Settings, FileCode, RefreshCcw, Clock, Activity, 
  HardDrive, Cpu, CircuitBoard
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AddSiteModal } from "@/components/AddSiteModal";
import { LogsModal } from "@/components/LogsModal";

const cpuData = [
  { time: "00:00", usage: 25 },
  { time: "02:00", usage: 30 },
  { time: "04:00", usage: 22 },
  { time: "06:00", usage: 18 },
  { time: "08:00", usage: 35 },
  { time: "10:00", usage: 48 },
  { time: "12:00", usage: 52 },
  { time: "14:00", usage: 40 },
  { time: "16:00", usage: 37 },
  { time: "18:00", usage: 30 },
  { time: "20:00", usage: 25 },
  { time: "22:00", usage: 20 },
];

interface Service {
  name: string;
  status: "active" | "inactive" | "warning";
  version: string;
  icon: React.ReactNode;
  route: string;
  uptime: string;
}

const Index = () => {
  const [cpuUsage, setCpuUsage] = useState(35);
  const [memoryUsage, setMemoryUsage] = useState(42);
  const [diskUsage, setDiskUsage] = useState(58);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prevUsage => {
        const change = Math.random() * 10 - 5;
        return Math.min(Math.max(prevUsage + change, 5), 95);
      });
      
      setMemoryUsage(prevUsage => {
        const change = Math.random() * 8 - 4;
        return Math.min(Math.max(prevUsage + change, 10), 90);
      });
    }, 5000);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const services: Service[] = [
    {
      name: "Nginx",
      status: "active",
      version: "1.22.1",
      icon: <Server className="w-5 h-5" />,
      route: "/nginx",
      uptime: "15d 7h 23m"
    },
    {
      name: "PHP-FPM",
      status: "active",
      version: "8.2.7",
      icon: <Code2 className="w-5 h-5" />,
      route: "/php",
      uptime: "15d 7h 22m"
    },
    {
      name: "MySQL",
      status: "active",
      version: "8.0.33",
      icon: <Database className="w-5 h-5" />,
      route: "/mysql",
      uptime: "15d 7h 23m"
    }
  ];

  const recentActivities = [
    { id: 1, activity: "Nginx configuration updated", time: "10 minutes ago" },
    { id: 2, activity: "MySQL backup completed", time: "45 minutes ago" },
    { id: 3, activity: "PHP module installed: imagick", time: "2 hours ago" },
    { id: 4, activity: "System update completed", time: "5 hours ago" },
  ];

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleRestartAll = () => {
    toast({
      title: "Restarting all services",
      description: "All services are being restarted...",
    });
    
    // Simulate service restart
    setTimeout(() => {
      toast({
        title: "Services Restarted",
        description: "All services have been restarted successfully.",
      });
    }, 2000);
  };

  const handleAddSite = () => {
    setIsAddSiteModalOpen(true);
  };

  const handleViewLogs = () => {
    setIsLogsModalOpen(true);
  };

  return (
    <Layout>
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Server monitoring and management</p>
            </div>
            <div className="glass-panel px-4 py-2 rounded-lg text-right">
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
              <p className="text-xl font-mono">{formattedTime}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {services.map((service, index) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
          >
            <Card className="overflow-hidden smooth-transition hover:shadow-md hover:border-primary/50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 p-2 rounded-md">
                    {service.icon}
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    service.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                    service.status === "warning" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : 
                    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {service.status === "active" ? "Running" : 
                     service.status === "warning" ? "Warning" : "Stopped"}
                  </div>
                </div>
                <CardTitle className="mt-2">{service.name}</CardTitle>
                <CardDescription>Version: {service.version}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Uptime: {service.uptime}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-between" asChild>
                  <a href={service.route}>
                    Manage
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                System Resources
              </CardTitle>
              <CardDescription>Current utilization of system resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Cpu className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">CPU Usage</span>
                  </div>
                  <span className="text-sm font-medium">{cpuUsage.toFixed(1)}%</span>
                </div>
                <Progress value={cpuUsage} className="h-2" indicatorClassName="bg-blue-500" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <CircuitBoard className="w-4 h-4 mr-2 text-purple-500" />
                    <span className="font-medium">Memory Usage</span>
                  </div>
                  <span className="text-sm font-medium">{memoryUsage.toFixed(1)}%</span>
                </div>
                <Progress value={memoryUsage} className="h-2" indicatorClassName="bg-purple-500" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <HardDrive className="w-4 h-4 mr-2 text-emerald-500" />
                    <span className="font-medium">Disk Usage</span>
                  </div>
                  <span className="text-sm font-medium">{diskUsage.toFixed(1)}%</span>
                </div>
                <Progress value={diskUsage} className="h-2" indicatorClassName="bg-emerald-500" />
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-4">CPU Load (24 hours)</h4>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cpuData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="cpuColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                      <YAxis unit="%" tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="usage"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#cpuColor)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest actions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.li
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="flex items-start pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium">{activity.activity}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-between">
                View All Activities
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-8"
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Button 
            variant="outline" 
            className="h-auto flex-col py-6 gap-2 hover:border-primary/50 hover:bg-primary/5 smooth-transition"
            onClick={() => navigate('/nginx')}
          >
            <FileCode className="w-6 h-6 text-primary" />
            <span>Site Config</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col py-6 gap-2 hover:border-primary/50 hover:bg-primary/5 smooth-transition"
            onClick={() => navigate('/mysql')}
          >
            <Database className="w-6 h-6 text-primary" />
            <span>Databases</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col py-6 gap-2 hover:border-primary/50 hover:bg-primary/5 smooth-transition"
            onClick={handleRestartAll}
          >
            <RefreshCcw className="w-6 h-6 text-primary" />
            <span>Restart All</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col py-6 gap-2 hover:border-primary/50 hover:bg-primary/5 smooth-transition"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-6 h-6 text-primary" />
            <span>Settings</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col py-6 gap-2 hover:border-primary/50 hover:bg-primary/5 smooth-transition"
            onClick={handleAddSite}
          >
            <PlusCircle className="w-6 h-6 text-primary" />
            <span>Add Site</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col py-6 gap-2 hover:border-primary/50 hover:bg-primary/5 smooth-transition"
            onClick={handleViewLogs}
          >
            <Activity className="w-6 h-6 text-primary" />
            <span>Logs</span>
          </Button>
        </div>
      </motion.div>

      <AddSiteModal 
        open={isAddSiteModalOpen} 
        onOpenChange={setIsAddSiteModalOpen} 
      />
      
      <LogsModal 
        open={isLogsModalOpen} 
        onOpenChange={setIsLogsModalOpen} 
      />
    </Layout>
  );
};

export default Index;
