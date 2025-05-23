
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LogsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LogEntry {
  id: number;
  timestamp: string;
  level: "info" | "warning" | "error";
  service: string;
  message: string;
}

export const LogsModal = ({ open, onOpenChange }: LogsModalProps) => {
  const [selectedService, setSelectedService] = useState("all");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock log data
  const mockLogs: LogEntry[] = [
    {
      id: 1,
      timestamp: new Date().toLocaleString(),
      level: "info",
      service: "nginx",
      message: "Server started successfully on port 80"
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 60000).toLocaleString(),
      level: "warning",
      service: "php-fpm",
      message: "Slow query detected: 2.3s execution time"
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 120000).toLocaleString(),
      level: "error",
      service: "mysql",
      message: "Connection timeout for user 'webapp'"
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 180000).toLocaleString(),
      level: "info",
      service: "nginx",
      message: "Configuration reloaded successfully"
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 300000).toLocaleString(),
      level: "info",
      service: "php-fpm",
      message: "Process pool restarted"
    }
  ];

  useEffect(() => {
    if (open) {
      setLogs(mockLogs);
    }
  }, [open]);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate log refresh
    setTimeout(() => {
      setLogs([...mockLogs]);
      setIsLoading(false);
      toast({
        title: "Logs Refreshed",
        description: "Latest logs have been loaded",
      });
    }, 1000);
  };

  const handleDownload = () => {
    toast({
      title: "Downloading Logs",
      description: "Log file download will start shortly",
    });
  };

  const filteredLogs = selectedService === "all" 
    ? logs 
    : logs.filter(log => log.service === selectedService);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      case "info":
      default:
        return "default";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>System Logs</DialogTitle>
          <DialogDescription>
            View and monitor system logs from all services
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-4 mb-4">
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="nginx">Nginx</SelectItem>
              <SelectItem value="php-fpm">PHP-FPM</SelectItem>
              <SelectItem value="mysql">MySQL</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        <ScrollArea className="h-[400px] w-full border rounded-md p-4">
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 p-2 hover:bg-muted rounded-sm">
                <Badge variant={getLevelColor(log.level)} className="text-xs">
                  {log.level.toUpperCase()}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{log.service}</span>
                    <span className="text-muted-foreground text-xs">{log.timestamp}</span>
                  </div>
                  <p className="text-sm mt-1 break-words">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
