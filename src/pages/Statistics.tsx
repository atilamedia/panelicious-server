
import { useState } from "react";
import { 
  BarChart3, RefreshCcw, AreaChart, Calendar, Clock, 
  Download, Filter, Database, Server, Code2, HardDrive
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart as RechartsAreaChart,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartContainer } from "@/components/ui/chart";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";

// Mock data for server resources
const resourceUsageData = [
  { name: "00:00", cpu: 25, ram: 40, disk: 15 },
  { name: "03:00", cpu: 30, ram: 45, disk: 16 },
  { name: "06:00", cpu: 45, ram: 55, disk: 16 },
  { name: "09:00", cpu: 65, ram: 60, disk: 17 },
  { name: "12:00", cpu: 85, ram: 75, disk: 18 },
  { name: "15:00", cpu: 70, ram: 65, disk: 19 },
  { name: "18:00", cpu: 55, ram: 50, disk: 20 },
  { name: "21:00", cpu: 30, ram: 45, disk: 20 },
];

// Mock data for service requests
const serviceRequestsData = [
  { name: "Mon", nginx: 320, php: 240, mysql: 180 },
  { name: "Tue", nginx: 380, php: 290, mysql: 190 },
  { name: "Wed", nginx: 420, php: 320, mysql: 210 },
  { name: "Thu", nginx: 390, php: 270, mysql: 200 },
  { name: "Fri", nginx: 450, php: 340, mysql: 230 },
  { name: "Sat", nginx: 280, php: 190, mysql: 160 },
  { name: "Sun", nginx: 240, php: 170, mysql: 140 },
];

// Mock data for traffic distribution
const trafficDistributionData = [
  { name: "Nginx", value: 45 },
  { name: "PHP", value: 30 },
  { name: "MySQL", value: 15 },
  { name: "Other", value: 10 },
];

// Mock data for error rates
const errorRatesData = [
  { name: "Mon", nginx: 5, php: 8, mysql: 3 },
  { name: "Tue", nginx: 7, php: 6, mysql: 2 },
  { name: "Wed", nginx: 3, php: 9, mysql: 4 },
  { name: "Thu", nginx: 6, php: 5, mysql: 3 },
  { name: "Fri", nginx: 8, php: 7, mysql: 5 },
  { name: "Sat", nginx: 4, php: 3, mysql: 2 },
  { name: "Sun", nginx: 3, php: 4, mysql: 1 },
];

// Colors for charts
const COLORS = {
  nginx: "#3b82f6", // blue
  php: "#6366f1", // indigo
  mysql: "#8b5cf6", // violet
  cpu: "#ef4444", // red
  ram: "#f59e0b", // amber
  disk: "#10b981", // emerald
  other: "#6b7280", // gray
};

// Pie chart colors
const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#ef4444", "#6b7280"];

const Statistics = () => {
  const [timeRange, setTimeRange] = useState("week");
  const { toast } = useToast();

  const handleRefreshData = () => {
    toast({
      title: "Refreshing Data",
      description: "Statistics are being updated...",
    });
    
    // Simulate data refresh
    setTimeout(() => {
      toast({
        title: "Data Refreshed",
        description: "Statistics have been updated successfully.",
      });
    }, 1500);
  };

  const handleDownloadReport = () => {
    toast({
      title: "Downloading Report",
      description: "Your statistics report is being generated...",
    });
    
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your statistics report has been downloaded successfully.",
      });
    }, 2000);
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
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-700 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Statistics</h1>
              <p className="text-muted-foreground">System performance and usage analytics</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleRefreshData}
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDownloadReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Server Load
            </CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">
              +12% from last {timeRange}
            </p>
            <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: "65%" }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              PHP Processes
            </CardTitle>
            <Code2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">238</div>
            <p className="text-xs text-muted-foreground">
              +5% from last {timeRange}
            </p>
            <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: "53%" }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Database Size
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.8 GB</div>
            <p className="text-xs text-muted-foreground">
              +1.2 GB from last {timeRange}
            </p>
            <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="bg-violet-500 h-full rounded-full" style={{ width: "39%" }}></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="resources" className="space-y-8">
          <TabsList>
            <TabsTrigger value="resources" className="gap-2">
              <HardDrive className="w-4 h-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <AreaChart className="w-4 h-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="distribution" className="gap-2">
              <PieChart className="w-4 h-4" />
              Distribution
            </TabsTrigger>
            <TabsTrigger value="errors" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Errors
            </TabsTrigger>
          </TabsList>

          {/* Resources Usage Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-primary" />
                  System Resource Usage
                </CardTitle>
                <CardDescription>CPU, RAM, and Disk usage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={resourceUsageData}
                      margin={{ top: 20, right: 30, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="cpu" 
                        stroke={COLORS.cpu} 
                        activeDot={{ r: 8 }} 
                        name="CPU (%)"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ram" 
                        stroke={COLORS.ram} 
                        name="RAM (%)"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="disk" 
                        stroke={COLORS.disk} 
                        name="Disk Usage (GB)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AreaChart className="w-5 h-5 text-primary" />
                  Service Requests
                </CardTitle>
                <CardDescription>Request volume by service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsAreaChart
                      data={serviceRequestsData}
                      margin={{ top: 20, right: 30, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="nginx" 
                        stackId="1"
                        fill={COLORS.nginx} 
                        stroke={COLORS.nginx} 
                        name="Nginx Requests"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="php" 
                        stackId="1"
                        fill={COLORS.php} 
                        stroke={COLORS.php} 
                        name="PHP Requests"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="mysql" 
                        stackId="1"
                        fill={COLORS.mysql} 
                        stroke={COLORS.mysql} 
                        name="MySQL Queries"
                      />
                    </RechartsAreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Traffic Distribution
                </CardTitle>
                <CardDescription>Resource usage distribution by service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trafficDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={140}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {trafficDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, "Percentage"]} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Errors Tab */}
          <TabsContent value="errors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Error Rates
                </CardTitle>
                <CardDescription>Service errors over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={errorRatesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="nginx" name="Nginx Errors" fill={COLORS.nginx} />
                      <Bar dataKey="php" name="PHP Errors" fill={COLORS.php} />
                      <Bar dataKey="mysql" name="MySQL Errors" fill={COLORS.mysql} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Statistics;
