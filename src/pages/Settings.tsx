
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  User, Lock, Mail, BellRing, Globe, 
  Shield, Database, Server, Cpu, 
  HardDrive, PanelTop, MonitorSmartphone, 
  Sliders
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [logLevel, setLogLevel] = useState("info");
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleSaveSettings = (section: string) => {
    toast({
      title: "Settings Saved",
      description: `Your ${section} settings have been saved successfully.`,
    });
  };

  const handleSystemRestart = () => {
    toast({
      title: "System Restart Initiated",
      description: "The system is restarting. This may take a few minutes.",
    });
    setConfirmResetOpen(false);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, application preferences, and system configurations.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="account" className="flex gap-2 items-center">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex gap-2 items-center">
              <Sliders className="h-4 w-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex gap-2 items-center">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Manage your personal information and account settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue="Admin User" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="admin" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="admin@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Administrator" disabled />
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings("profile")}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>
                  Update your password and configure security preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="twoFactor" />
                    <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enhance your account security by requiring a verification code in addition to your password when logging in.
                  </p>
                </div>
                <Button onClick={() => handleSaveSettings("security")}>
                  Update Security Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotif">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive system alerts and updates via email.
                      </p>
                    </div>
                    <Switch id="emailNotif" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="browserNotif">Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications in your browser when important events occur.
                      </p>
                    </div>
                    <Switch id="browserNotif" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenanceNotif">Maintenance Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about scheduled maintenance and system updates.
                      </p>
                    </div>
                    <Switch id="maintenanceNotif" defaultChecked />
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings("notifications")}>
                  Save Notification Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Application Preferences */}
          <TabsContent value="preferences" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PanelTop className="h-5 w-5" />
                  Interface Settings
                </CardTitle>
                <CardDescription>
                  Customize the application interface to your preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compactMode">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use a more compact interface with reduced spacing.
                      </p>
                    </div>
                    <Switch id="compactMode" />
                  </div>
                  
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <RadioGroup id="theme" defaultValue="system" className="flex flex-col space-y-1 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light">Light</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark">Dark</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system">System Default</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="language">Display Language</Label>
                    <RadioGroup id="language" defaultValue="en" className="flex flex-col space-y-1 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="en" id="lang-en" />
                        <Label htmlFor="lang-en">English</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fr" id="lang-fr" />
                        <Label htmlFor="lang-fr">French</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="de" id="lang-de" />
                        <Label htmlFor="lang-de">German</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="es" id="lang-es" />
                        <Label htmlFor="lang-es">Spanish</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings("interface")}>
                  Save Interface Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Configure how data is displayed and managed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pageSize">Default Page Size</Label>
                    <RadioGroup id="pageSize" defaultValue="25" className="flex flex-col space-y-1 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="10" id="size-10" />
                        <Label htmlFor="size-10">10 items per page</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="25" id="size-25" />
                        <Label htmlFor="size-25">25 items per page</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="50" id="size-50" />
                        <Label htmlFor="size-50">50 items per page</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="100" id="size-100" />
                        <Label htmlFor="size-100">100 items per page</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="confirmDeletes">Confirm Deletions</Label>
                      <p className="text-sm text-muted-foreground">
                        Show confirmation dialog before deleting items.
                      </p>
                    </div>
                    <Switch id="confirmDeletes" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoRefresh">Auto-Refresh Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically refresh data displays every minute.
                      </p>
                    </div>
                    <Switch id="autoRefresh" defaultChecked />
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings("data management")}>
                  Save Data Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Configuration */}
          <TabsContent value="system" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Server Configuration
                </CardTitle>
                <CardDescription>
                  Configure server settings and behavior.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hostname">Hostname</Label>
                    <Input id="hostname" defaultValue="server-01" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ipAddress">IP Address</Label>
                    <Input id="ipAddress" defaultValue="192.168.1.100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sshPort">SSH Port</Label>
                  <Input id="sshPort" type="number" defaultValue="22" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sshEnabled" defaultChecked />
                    <Label htmlFor="sshEnabled">Enable SSH Access</Label>
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings("server configuration")}>
                  Save Server Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup & Restore
                </CardTitle>
                <CardDescription>
                  Configure system backup settings and restore points.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backupPath">Backup Directory</Label>
                  <Input id="backupPath" defaultValue="/var/backups/hostpanel" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupFreq">Backup Frequency</Label>
                  <RadioGroup 
                    id="backupFreq" 
                    value={backupFrequency} 
                    onValueChange={setBackupFrequency}
                    className="flex flex-col space-y-1 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hourly" id="freq-hourly" />
                      <Label htmlFor="freq-hourly">Hourly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="freq-daily" />
                      <Label htmlFor="freq-daily">Daily</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="freq-weekly" />
                      <Label htmlFor="freq-weekly">Weekly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="freq-monthly" />
                      <Label htmlFor="freq-monthly">Monthly</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="compressBackups" defaultChecked />
                    <Label htmlFor="compressBackups">Compress Backups</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="encryptBackups" />
                    <Label htmlFor="encryptBackups">Encrypt Backups</Label>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => handleSaveSettings("backup")}>
                    Save Backup Settings
                  </Button>
                  <Button variant="outline">
                    Create Manual Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Firewall
                </CardTitle>
                <CardDescription>
                  Configure system security settings and firewall rules.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="firewallEnabled" defaultChecked />
                    <Label htmlFor="firewallEnabled">Enable Firewall</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowedIPs">Allowed IP Addresses</Label>
                  <Textarea 
                    id="allowedIPs" 
                    className="h-20" 
                    placeholder="Enter IP addresses, one per line"
                    defaultValue="192.168.1.0/24&#10;10.0.0.0/8"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter IP addresses or CIDR notation, one per line
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="blockUnknownIPs" defaultChecked />
                    <Label htmlFor="blockUnknownIPs">Block Unknown IP Addresses</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="failedLoginLock" defaultChecked />
                    <Label htmlFor="failedLoginLock">Lock Account After Failed Logins</Label>
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings("security & firewall")}>
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MonitorSmartphone className="h-5 w-5" />
                  System Monitoring
                </CardTitle>
                <CardDescription>
                  Configure system monitoring and logging settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logPath">Log Directory</Label>
                  <Input id="logPath" defaultValue="/var/log/hostpanel" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logLevel">Log Level</Label>
                  <RadioGroup 
                    id="logLevel" 
                    value={logLevel} 
                    onValueChange={setLogLevel}
                    className="flex flex-col space-y-1 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="debug" id="log-debug" />
                      <Label htmlFor="log-debug">Debug</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="info" id="log-info" />
                      <Label htmlFor="log-info">Info</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="warning" id="log-warning" />
                      <Label htmlFor="log-warning">Warning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="error" id="log-error" />
                      <Label htmlFor="log-error">Error</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="monitoringEnabled" defaultChecked />
                    <Label htmlFor="monitoringEnabled">Enable System Monitoring</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Collect system metrics for CPU, memory, disk usage, and network traffic.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="alertOnHigh" defaultChecked />
                    <Label htmlFor="alertOnHigh">Alert on High Resource Usage</Label>
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings("system monitoring")}>
                  Save Monitoring Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Cpu className="h-5 w-5" />
                  System Maintenance
                </CardTitle>
                <CardDescription>
                  Perform system maintenance tasks and operations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline">
                    Check for Updates
                  </Button>
                  <Button variant="outline">
                    Clean Temp Files
                  </Button>
                  <Dialog open={confirmResetOpen} onOpenChange={setConfirmResetOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        Restart System
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm System Restart</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to restart the system? All services will be temporarily unavailable.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmResetOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleSystemRestart}>
                          Yes, Restart System
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
