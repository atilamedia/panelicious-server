
import React, { useState } from "react";
import { ArrowLeft, Clock, RefreshCcw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

interface Activity {
  id: number;
  activity: string;
  time: string;
  type: "info" | "warning" | "error" | "success";
  service: string;
  details?: string;
}

const Activities = () => {
  const [filterType, setFilterType] = useState("all");
  const [filterService, setFilterService] = useState("all");

  // Extended mock activities data
  const allActivities: Activity[] = [
    {
      id: 1,
      activity: "Nginx configuration updated",
      time: "10 minutes ago",
      type: "success",
      service: "nginx",
      details: "Updated server block for example.com"
    },
    {
      id: 2,
      activity: "MySQL backup completed",
      time: "45 minutes ago",
      type: "success",
      service: "mysql",
      details: "Backup size: 2.4GB, Duration: 3m 45s"
    },
    {
      id: 3,
      activity: "PHP module installed: imagick",
      time: "2 hours ago",
      type: "info",
      service: "php",
      details: "ImageMagick PHP extension installed successfully"
    },
    {
      id: 4,
      activity: "System update completed",
      time: "5 hours ago",
      type: "success",
      service: "system",
      details: "Updated 23 packages"
    },
    {
      id: 5,
      activity: "SSL certificate renewed",
      time: "1 day ago",
      type: "success",
      service: "nginx",
      details: "Let's Encrypt certificate for example.com"
    },
    {
      id: 6,
      activity: "High memory usage detected",
      time: "1 day ago",
      type: "warning",
      service: "system",
      details: "Memory usage reached 85%"
    },
    {
      id: 7,
      activity: "MySQL slow query detected",
      time: "2 days ago",
      type: "warning",
      service: "mysql",
      details: "Query execution time: 4.2 seconds"
    },
    {
      id: 8,
      activity: "PHP-FPM process restarted",
      time: "2 days ago",
      type: "info",
      service: "php",
      details: "Process pool restarted due to configuration change"
    },
    {
      id: 9,
      activity: "Disk space warning",
      time: "3 days ago",
      type: "warning",
      service: "system",
      details: "Root partition usage: 78%"
    },
    {
      id: 10,
      activity: "Security update applied",
      time: "3 days ago",
      type: "success",
      service: "system",
      details: "Applied critical security patches"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      case "success":
        return "default";
      case "info":
      default:
        return "outline";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "error":
        return "🔴";
      case "warning":
        return "🟡";
      case "success":
        return "🟢";
      case "info":
      default:
        return "🔵";
    }
  };

  const filteredActivities = allActivities.filter(activity => {
    const typeMatch = filterType === "all" || activity.type === filterType;
    const serviceMatch = filterService === "all" || activity.service === filterService;
    return typeMatch && serviceMatch;
  });

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">System Activities</h1>
            <p className="text-muted-foreground mt-1">Complete history of system events and actions</p>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterService} onValueChange={setFilterService}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="nginx">Nginx</SelectItem>
            <SelectItem value="php">PHP-FPM</SelectItem>
            <SelectItem value="mysql">MySQL</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Activity Log ({filteredActivities.length} entries)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="text-2xl flex-shrink-0 mt-1">
                  {getTypeIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{activity.activity}</h3>
                    <Badge variant={getTypeColor(activity.type)} className="text-xs">
                      {activity.type.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {activity.service}
                    </Badge>
                  </div>
                  
                  {activity.details && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {activity.details}
                    </p>
                  )}
                  
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Activities;
