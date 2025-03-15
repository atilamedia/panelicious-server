import { useState } from "react";
import { 
  Database, RefreshCcw, PlayCircle, StopCircle, 
  Check, X, Save, Settings2, Plus, FileSearch,
  Lock, Users, Shield, Table, Layers, ChevronDown,
  ChevronUp, FileEdit, AlertTriangle
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table as UITable, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";
import { CreateDatabaseForm } from "@/components/CreateDatabaseForm";

const initialPlugins = [
  { name: "mysql_native_password", status: true, description: "Native MySQL authentication" },
  { name: "validate_password", status: true, description: "Password validation plugin" },
  { name: "auth_socket", status: true, description: "Authentication based on Unix sockets" },
  { name: "query_cache_options", status: false, description: "Optimizes query caching" },
  { name: "innodb_file_per_table", status: true, description: "Stores InnoDB tables in separate files" },
  { name: "performance_schema", status: true, description: "Performance monitoring" },
  { name: "binlog", status: true, description: "Binary logging for replication" },
  { name: "group_replication", status: false, description: "Multi-master replication" },
  { name: "connection_control", status: false, description: "Failed login attempt tracking" },
  { name: "ssl", status: true, description: "SSL/TLS support" },
  { name: "thread_pool", status: false, description: "Thread pooling for connections" },
  { name: "simple_parser", status: true, description: "Full-text search parser" },
];

const initialDatabases = [
  { name: "wordpress", tables: 12, size: "24.5 MB", created: "2023-06-15" },
  { name: "ecommerce", tables: 23, size: "56.2 MB", created: "2023-07-22" },
  { name: "analytics", tables: 8, size: "128.7 MB", created: "2023-05-10" },
  { name: "test", tables: 3, size: "0.8 MB", created: "2023-08-05" },
];

const initialUsers = [
  { username: "admin", host: "localhost", privileges: "ALL PRIVILEGES", authentication: "Native", database: "None" },
  { username: "wordpress", host: "%", privileges: "SELECT, INSERT, UPDATE", authentication: "Native", database: "wordpress" },
  { username: "backup", host: "localhost", privileges: "SELECT, LOCK TABLES", authentication: "Socket", database: "None" },
  { username: "read_only", host: "192.168.1.%", privileges: "SELECT", authentication: "Native", database: "None" },
];

const initialMySQLConfig = `[mysqld]
# Basic Settings
user                    = mysql
pid-file                = /var/run/mysqld/mysqld.pid
socket                  = /var/run/mysqld/mysqld.sock
port                    = 3306
basedir                 = /usr
datadir                 = /var/lib/mysql
tmpdir                  = /tmp
lc-messages-dir         = /usr/share/mysql

# General
bind-address            = 127.0.0.1
key_buffer_size         = 16M
max_allowed_packet      = 16M
thread_stack            = 192K
thread_cache_size       = 8
myisam-recover-options  = BACKUP
max_connections         = 100
table_open_cache        = 64
thread_concurrency      = 10

# InnoDB
innodb_buffer_pool_size = 128M
innodb_log_file_size    = 32M
innodb_file_per_table   = 1
innodb_open_files       = 400
innodb_io_capacity      = 400
innodb_flush_method     = O_DIRECT

# Logging and Replication
log_error               = /var/log/mysql/error.log
expire_logs_days        = 10
max_binlog_size         = 100M
binlog_format           = ROW
slow_query_log          = 1
slow_query_log_file     = /var/log/mysql/mysql-slow.log
long_query_time         = 2

# Security
sql_mode                = NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES
symbolic-links          = 0

# Query Cache Configuration
query_cache_size        = 16M
query_cache_limit       = 1M
query_cache_type        = 1`;

const MySQL = () => {
  const [plugins, setPlugins] = useState(initialPlugins);
  const [databases, setDatabases] = useState(initialDatabases);
  const [users, setUsers] = useState(initialUsers);
  const [mysqlConfig, setMysqlConfig] = useState(initialMySQLConfig);
  const [serviceStatus, setServiceStatus] = useState<"active" | "inactive">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDb, setExpandedDb] = useState<string | null>(null);
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    host: "localhost",
    password: "",
    privileges: "SELECT",
    database: ""
  });
  const { toast } = useToast();

  const togglePlugin = (pluginName: string) => {
    setPlugins(plugins.map(plugin => 
      plugin.name === pluginName 
        ? { ...plugin, status: !plugin.status } 
        : plugin
    ));
    
    toast({
      title: `Plugin ${pluginName}`,
      description: `${pluginName} plugin has been ${
        plugins.find(p => p.name === pluginName)?.status ? "disabled" : "enabled"
      }.`
    });
  };

  const toggleDbExpansion = (dbName: string) => {
    if (expandedDb === dbName) {
      setExpandedDb(null);
    } else {
      setExpandedDb(dbName);
    }
  };

  const handleSaveConfig = () => {
    toast({
      title: "Configuration Saved",
      description: "MySQL configuration has been saved successfully."
    });
  };

  const handleRestartMySQL = () => {
    toast({
      title: "Restarting MySQL",
      description: "MySQL service is being restarted..."
    });
    
    setTimeout(() => {
      toast({
        title: "MySQL Restarted",
        description: "MySQL service has been restarted successfully."
      });
    }, 2000);
  };

  const toggleServiceStatus = () => {
    const newStatus = serviceStatus === "active" ? "inactive" : "active";
    
    toast({
      title: serviceStatus === "active" ? "Stopping MySQL" : "Starting MySQL",
      description: serviceStatus === "active" 
        ? "MySQL service is being stopped..." 
        : "MySQL service is being started..."
    });
    
    setTimeout(() => {
      setServiceStatus(newStatus);
      toast({
        title: serviceStatus === "active" ? "MySQL Stopped" : "MySQL Started",
        description: serviceStatus === "active" 
          ? "MySQL service has been stopped successfully." 
          : "MySQL service has been started successfully."
      });
    }, 1500);
  };

  const handleCreateDatabase = (newDatabase: any) => {
    setDatabases([...databases, newDatabase]);
    
    toast({
      title: "Database Created",
      description: `New database ${newDatabase.name} has been created.`
    });
  };

  const handleCreateUser = () => {
    if (!newUserForm.username) {
      toast({
        title: "Error",
        description: "Username is required.",
        variant: "destructive"
      });
      return;
    }

    const newUser = {
      username: newUserForm.username,
      host: newUserForm.host || "localhost",
      privileges: newUserForm.privileges,
      authentication: "Native",
      database: newUserForm.database || "None"
    };
    
    setUsers([...users, newUser]);
    
    setNewUserForm({
      username: "",
      host: "localhost",
      password: "",
      privileges: "SELECT",
      database: ""
    });
    
    toast({
      title: "User Created",
      description: `New user ${newUser.username} has been created${newUser.database ? ` and assigned to database ${newUser.database}` : ""}.`
    });
  };

  const handleNewUserFormChange = (field: string, value: string) => {
    setNewUserForm({
      ...newUserForm,
      [field]: value
    });
  };

  const filteredPlugins = plugins.filter(plugin => 
    plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">MySQL Management</h1>
              <p className="text-muted-foreground">Configure MySQL databases, users and plugins</p>
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
              onClick={handleRestartMySQL}
            >
              <RefreshCcw className="w-4 h-4" />
              Restart
            </Button>
          </div>
        </div>
        
        <div className="mt-6 glass-panel p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-3 w-3 rounded-full",
              serviceStatus === "active" ? "bg-green-500 animate-pulse" : "bg-red-500"
            )}></div>
            <div>
              <p className="font-medium">Service Status: {serviceStatus === "active" ? "Running" : "Stopped"}</p>
              <p className="text-sm text-muted-foreground">Version: MySQL 8.0.32</p>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <p className="text-sm text-muted-foreground">Port</p>
            <p className="font-mono text-sm">3306</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs defaultValue="databases">
          <TabsList className="mb-6">
            <TabsTrigger value="databases" className="gap-2">
              <Table className="w-4 h-4" />
              Databases
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="plugins" className="gap-2">
              <Layers className="w-4 h-4" />
              Plugins
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings2 className="w-4 h-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="status" className="gap-2">
              <FileSearch className="w-4 h-4" />
              Status
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="databases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Table className="w-5 h-5 text-primary" />
                    MySQL Databases
                  </span>
                  <CreateDatabaseForm onDatabaseCreated={handleCreateDatabase} />
                </CardTitle>
                <CardDescription>Manage your MySQL databases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {databases.map((database) => (
                    <Collapsible 
                      key={database.name}
                      open={expandedDb === database.name}
                      onOpenChange={() => toggleDbExpansion(database.name)}
                      className="border rounded-md"
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Database className="w-5 h-5 text-primary" />
                            <div>
                              <h3 className="font-medium">{database.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {database.tables} tables, {database.size}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground hidden sm:inline">
                              Created: {database.created}
                            </span>
                            {expandedDb === database.name ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="border-t p-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="p-3 bg-muted/50 rounded-md">
                              <p className="text-sm text-muted-foreground">Size</p>
                              <p className="font-medium">{database.size}</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-md">
                              <p className="text-sm text-muted-foreground">Tables</p>
                              <p className="font-medium">{database.tables}</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-md">
                              <p className="text-sm text-muted-foreground">Created</p>
                              <p className="font-medium">{database.created}</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-md">
                              <p className="text-sm text-muted-foreground">Collation</p>
                              <p className="font-medium">utf8mb4_general_ci</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 mt-4">
                            <Button size="sm" variant="outline">
                              <FileEdit className="w-4 h-4 mr-2" />
                              Query
                            </Button>
                            <Button size="sm" variant="outline">
                              <Users className="w-4 h-4 mr-2" />
                              Privileges
                            </Button>
                            <Button size="sm" variant="destructive">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    MySQL Users
                  </span>
                  <Button onClick={() => {
                    const newUser = {
                      username: `user_${users.length + 1}`,
                      host: "localhost",
                      privileges: "SELECT",
                      authentication: "Native",
                      database: "None"
                    };
                    setUsers([...users, newUser]);
                    toast({
                      title: "User Created",
                      description: `Quick new user ${newUser.username} has been created.`
                    });
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Quick Add
                  </Button>
                </CardTitle>
                <CardDescription>Manage MySQL users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <UITable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Privileges</TableHead>
                      <TableHead>Authentication</TableHead>
                      <TableHead>Database</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={`${user.username}-${user.host}-${index}`}>
                        <TableCell className="font-medium">
                          {user.username}
                        </TableCell>
                        <TableCell>
                          {user.host}
                        </TableCell>
                        <TableCell>
                          {user.privileges}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.authentication === "Native" ? (
                              <div className="flex items-center gap-1">
                                <Lock className="w-4 h-4 text-blue-500" />
                                <span>Native</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Shield className="w-4 h-4 text-green-500" />
                                <span>Socket</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.database || "None"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <FileEdit className="w-4 h-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="destructive" size="sm">
                              <X className="w-4 h-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </UITable>
                
                <div className="mt-6 border rounded-md p-4 bg-muted/20">
                  <h3 className="text-sm font-medium mb-2">Create User with Database Access</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Username</label>
                      <Input 
                        placeholder="Enter username" 
                        value={newUserForm.username}
                        onChange={(e) => handleNewUserFormChange("username", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Host</label>
                      <Input 
                        placeholder="localhost" 
                        value={newUserForm.host}
                        onChange={(e) => handleNewUserFormChange("host", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Password</label>
                      <Input 
                        type="password" 
                        placeholder="Enter password" 
                        value={newUserForm.password}
                        onChange={(e) => handleNewUserFormChange("password", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Grant</label>
                      <Select 
                        value={newUserForm.privileges}
                        onValueChange={(value) => handleNewUserFormChange("privileges", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select privileges" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SELECT">SELECT</SelectItem>
                          <SelectItem value="SELECT, INSERT, UPDATE">SELECT, INSERT, UPDATE</SelectItem>
                          <SelectItem value="ALL PRIVILEGES">ALL PRIVILEGES</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm text-muted-foreground mb-1 block">Assign Database</label>
                      <Select 
                        value={newUserForm.database}
                        onValueChange={(value) => handleNewUserFormChange("database", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select database (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {databases.map((db) => (
                            <SelectItem key={db.name} value={db.name}>
                              {db.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Assign this user to a specific database for access control
                      </p>
                    </div>
                  </div>
                  <Button className="mt-4" onClick={handleCreateUser}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="plugins" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" />
                    MySQL Plugins
                  </span>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search plugins..."
                      className="h-9 rounded-md px-3 py-2 text-sm border border-input bg-background"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardTitle>
                <CardDescription>Enable or disable MySQL plugins</CardDescription>
              </CardHeader>
              <CardContent>
                <UITable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plugin</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlugins.map((plugin) => (
                      <TableRow key={plugin.name}>
                        <TableCell className="font-medium">
                          {plugin.name}
                        </TableCell>
                        <TableCell>
                          {plugin.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <div className={cn(
                              "px-2 py-1 mr-4 rounded-full text-xs font-medium",
                              plugin.status 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                            )}>
                              {plugin.status ? "Enabled" : "Disabled"}
                            </div>
                            <Switch 
                              checked={plugin.status}
                              onCheckedChange={() => togglePlugin(plugin.name)}
                              className="data-[state=checked]:bg-green-500"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </UITable>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Install Plugin
                </Button>
                <Button onClick={handleRestartMySQL}>
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Apply Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-primary" />
                  MySQL Configuration
                </CardTitle>
                <CardDescription>Edit your MySQL server configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  className="font-mono h-[400px] resize-none"
                  value={mysqlConfig}
                  onChange={(e) => setMysqlConfig(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleRestartMySQL}>
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
          
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSearch className="w-5 h-5 text-primary" />
                  MySQL Status
                </CardTitle>
                <CardDescription>View detailed MySQL status information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto border rounded-md p-4 bg-white dark:bg-gray-900">
                  <div className="prose dark:prose-invert max-w-none">
                    <h2 className="mb-4 text-xl font-bold text-center text-primary border-b pb-2">MySQL 8.0.32</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Server Status</h3>
                        <table className="w-full border-collapse text-sm">
                          <tbody>
                            <tr className="bg-muted/50">
                              <td className="px-4 py-2 font-semibold">Uptime</td>
                              <td className="px-4 py-2">3 days, 7 hours, 14 minutes</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 font-semibold">Threads</td>
                              <td className="px-4 py-2">32 connected / 45 running</td>
                            </tr>
                            <tr className="bg-muted/50">
                              <td className="px-4 py-2 font-semibold">Questions</td>
                              <td className="px-4 py-2">14,523,678</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 font-semibold">Slow queries</td>
                              <td className="px-4 py-2">145</td>
                            </tr>
                            <tr className="bg-muted/50">
                              <td className="px-4 py-2 font-semibold">Opens</td>
                              <td className="px-4 py-2">3,278</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 font-semibold">Flush tables</td>
                              <td className="px-4 py-2">1</td>
                            </tr>
                            <tr className="bg-muted/50">
                              <td className="px-4 py-2 font-semibold">Open tables</td>
                              <td className="px-4 py-2">64</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Connection Statistics</h3>
                        <table className="w-full border-collapse text-sm">
                          <tbody>
                            <tr className="bg-muted/50">
                              <td className="px-4 py-2 font-semibold">Max connections</td>
                              <td className="px-4 py-2">100</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 font-semibold">Max used connections</td>
                              <td className="px-4 py-2">87</td>
                            </tr>
                            <tr className="bg-muted/50">
                              <td className="px-4 py-2 font-semibold">Aborted clients</td>
                              <td className="px-4 py-2">12</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 font-semibold">Aborted connects</td>
                              <td className="px-4 py-2">5</td>
                            </tr>
                            <tr className="bg-muted/50">
                              <td className="px-4 py-2 font-semibold">Total connects</td>
                              <td className="px-4 py-2">2,387</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 font-semibold">Connection errors</td>
                              <td className="px-4 py-2">3</td>
                            </tr>
                            <tr className="bg-muted/50">
                              <td className="px-4 py-2 font-semibold">Rejected connections</td>
                              <td className="px-4 py-2">0</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-6 mb-3">InnoDB Status</h3>
                    <div className="bg-muted/20 p-4 rounded-md font-mono text-xs overflow-auto">
                      <pre>
{`
====================================
2023-08-25 10:24:31 0x7f9b4c000700 INNODB MONITOR OUTPUT
====================================
Per second averages calculated from the last 30 seconds
-----------------
BACKGROUND THREAD
-----------------
srv_master_thread loops: 17 srv_active, 0 srv_shutdown, 11230 srv_idle
srv_master_thread log flush and writes: 11247
----------
SEMAPHORES
----------
OS WAIT ARRAY INFO: reservation count 413
OS WAIT ARRAY INFO: signal count 401
RW-shared spins 0, rounds 0, OS waits 0
RW-excl spins 0, rounds 0, OS waits 0
RW-sx spins 0, rounds 0, OS waits 0
Spin rounds per wait: 0.00 RW-shared, 0.00 RW-excl, 0.00 RW-sx
`}
                      </pre>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-6 mb-3">Active Plugins</h3>
                    <div className="flex flex-wrap gap-2">
                      {plugins
                        .filter(plugin => plugin.status)
                        .map(plugin => (
                          <div 
                            key={plugin.name}
                            className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                          >
                            {plugin.name}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleRestartMySQL} className="flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4" />
                  Refresh Status
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default MySQL;
