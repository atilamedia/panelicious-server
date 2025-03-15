import { useState } from "react";
import { 
  Code2, RefreshCcw, Server, PlayCircle, StopCircle, 
  Check, X, Save, Settings2, Wrench, Plus, FileSearch
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";

// Mock PHP modules data
const initialModules = [
  { name: "bcmath", status: true, description: "Arbitrary Precision Mathematics" },
  { name: "calendar", status: true, description: "Calendar conversion functions" },
  { name: "curl", status: true, description: "Client URL library" },
  { name: "exif", status: false, description: "Exchangeable image information" },
  { name: "fileinfo", status: true, description: "File Information" },
  { name: "ftp", status: false, description: "FTP client" },
  { name: "gd", status: true, description: "Image Processing and GD" },
  { name: "gettext", status: false, description: "Gettext" },
  { name: "gmp", status: false, description: "GNU Multiple Precision" },
  { name: "iconv", status: true, description: "iconv character set conversion" },
  { name: "intl", status: true, description: "Internationalization" },
  { name: "mbstring", status: true, description: "Multibyte string" },
  { name: "mysqli", status: true, description: "MySQL Improved Extension" },
  { name: "opcache", status: true, description: "OPcache" },
  { name: "openssl", status: true, description: "OpenSSL" },
  { name: "pdo_mysql", status: true, description: "MySQL driver for PDO" },
  { name: "redis", status: false, description: "Redis PHP extension" },
  { name: "zip", status: true, description: "Zip archive" },
];

// Mock PHP-FPM pool configuration
const initialPoolConfig = `; Start a new pool named 'www'.
[www]

; Unix user/group of processes
user = www-data
group = www-data

; The address on which to accept FastCGI requests.
listen = /run/php/php8.2-fpm.sock
listen.owner = www-data
listen.group = www-data

; Process manager settings
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3

; Logging
php_admin_value[error_log] = /var/log/php8.2-fpm.log
php_admin_flag[log_errors] = on

; Environment variables
env[PATH] = /usr/local/bin:/usr/bin:/bin
env[TMP] = /tmp
env[TMPDIR] = /tmp
env[TEMP] = /tmp`;

// Mock PHP.ini configuration
const initialPhpIni = `[PHP]
engine = On
short_open_tag = Off
precision = 14
output_buffering = 4096
zlib.output_compression = Off
implicit_flush = Off
unserialize_callback_func =
serialize_precision = -1
disable_functions =
disable_classes =
zend.enable_gc = On
expose_php = On
max_execution_time = 30
max_input_time = 60
memory_limit = 128M
error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT
display_errors = Off
display_startup_errors = Off
log_errors = On
log_errors_max_len = 1024
ignore_repeated_errors = Off
ignore_repeated_source = Off
report_memleaks = On
html_errors = On
variables_order = "GPCS"
request_order = "GP"
register_argc_argv = Off
auto_globals_jit = On
post_max_size = 8M
auto_prepend_file =
auto_append_file =
default_mimetype = "text/html"
default_charset = "UTF-8"
doc_root =
user_dir =
enable_dl = Off
file_uploads = On
upload_max_filesize = 2M
max_file_uploads = 20
allow_url_fopen = On
allow_url_include = Off
default_socket_timeout = 60

[CLI Server]
cli_server.color = On

[Date]
date.timezone = UTC

[Pdo_mysql]
pdo_mysql.default_socket=

[mail function]
SMTP = localhost
smtp_port = 25
mail.add_x_header = Off

[SQL]
sql.safe_mode = Off

[ODBC]
odbc.allow_persistent = On
odbc.check_persistent = On
odbc.max_persistent = -1
odbc.max_links = -1
odbc.defaultlrl = 4096
odbc.defaultbinmode = 1

[MySQLi]
mysqli.max_persistent = -1
mysqli.allow_persistent = On
mysqli.max_links = -1
mysqli.default_port = 3306
mysqli.default_socket =
mysqli.default_host =
mysqli.default_user =
mysqli.default_pw =
mysqli.reconnect = Off

[mysqlnd]
mysqlnd.collect_statistics = On
mysqlnd.collect_memory_statistics = Off

[OPcache]
opcache.enable=1
opcache.enable_cli=0
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=10000
opcache.revalidate_freq=2
opcache.fast_shutdown=1`;

const PHP = () => {
  const [modules, setModules] = useState(initialModules);
  const [poolConfig, setPoolConfig] = useState(initialPoolConfig);
  const [phpIni, setPhpIni] = useState(initialPhpIni);
  const [serviceStatus, setServiceStatus] = useState<"active" | "inactive">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Toggle module status
  const toggleModule = (moduleName: string) => {
    setModules(modules.map(module => 
      module.name === moduleName 
        ? { ...module, status: !module.status } 
        : module
    ));
    
    toast({
      title: `Module ${moduleName}`,
      description: `${moduleName} module has been ${
        modules.find(m => m.name === moduleName)?.status ? "disabled" : "enabled"
      }.`
    });
  };

  // Handler to save PHP configuration
  const handleSaveConfig = () => {
    toast({
      title: "Configuration Saved",
      description: "PHP configuration has been saved successfully."
    });
  };

  // Handler to restart PHP-FPM
  const handleRestartPHP = () => {
    toast({
      title: "Restarting PHP-FPM",
      description: "PHP-FPM service is being restarted..."
    });
    
    // Simulate service restart
    setTimeout(() => {
      toast({
        title: "PHP-FPM Restarted",
        description: "PHP-FPM service has been restarted successfully."
      });
    }, 2000);
  };

  // Handler to toggle PHP-FPM service status
  const toggleServiceStatus = () => {
    const newStatus = serviceStatus === "active" ? "inactive" : "active";
    
    toast({
      title: serviceStatus === "active" ? "Stopping PHP-FPM" : "Starting PHP-FPM",
      description: serviceStatus === "active" 
        ? "PHP-FPM service is being stopped..." 
        : "PHP-FPM service is being started..."
    });
    
    // Simulate status change
    setTimeout(() => {
      setServiceStatus(newStatus);
      toast({
        title: serviceStatus === "active" ? "PHP-FPM Stopped" : "PHP-FPM Started",
        description: serviceStatus === "active" 
          ? "PHP-FPM service has been stopped successfully." 
          : "PHP-FPM service has been started successfully."
      });
    }, 1500);
  };

  // Filter modules based on search query
  const filteredModules = modules.filter(module => 
    module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Code2 className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">PHP Management</h1>
              <p className="text-muted-foreground">Configure PHP-FPM and modules</p>
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
              onClick={handleRestartPHP}
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
              <p className="text-sm text-muted-foreground">Version: PHP 8.2.7</p>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <p className="text-sm text-muted-foreground">Socket</p>
            <p className="font-mono text-sm">/run/php/php8.2-fpm.sock</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs defaultValue="modules">
          <TabsList className="mb-6">
            <TabsTrigger value="modules" className="gap-2">
              <Wrench className="w-4 h-4" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="php-fpm" className="gap-2">
              <Server className="w-4 h-4" />
              PHP-FPM Pools
            </TabsTrigger>
            <TabsTrigger value="php-ini" className="gap-2">
              <Settings2 className="w-4 h-4" />
              PHP.ini
            </TabsTrigger>
            <TabsTrigger value="phpinfo" className="gap-2">
              <FileSearch className="w-4 h-4" />
              PHP Info
            </TabsTrigger>
          </TabsList>
          
          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-primary" />
                    PHP Modules
                  </span>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search modules..."
                      className="h-9 rounded-md px-3 py-2 text-sm border border-input bg-background"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardTitle>
                <CardDescription>Enable or disable PHP modules</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredModules.map((module) => (
                      <TableRow key={module.name}>
                        <TableCell className="font-medium">
                          {module.name}
                        </TableCell>
                        <TableCell>
                          {module.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <div className={cn(
                              "px-2 py-1 mr-4 rounded-full text-xs font-medium",
                              module.status 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                            )}>
                              {module.status ? "Enabled" : "Disabled"}
                            </div>
                            <Switch 
                              checked={module.status}
                              onCheckedChange={() => toggleModule(module.name)}
                              className="data-[state=checked]:bg-green-500"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Install Module
                </Button>
                <Button onClick={handleRestartPHP}>
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Apply Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* PHP-FPM Pools Tab */}
          <TabsContent value="php-fpm" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-primary" />
                  PHP-FPM Pool Configuration
                </CardTitle>
                <CardDescription>Edit your PHP-FPM pool settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  className="font-mono h-[400px] resize-none"
                  value={poolConfig}
                  onChange={(e) => setPoolConfig(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleRestartPHP}>
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
          
          {/* PHP.ini Tab */}
          <TabsContent value="php-ini" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-primary" />
                  PHP.ini Configuration
                </CardTitle>
                <CardDescription>Edit your main PHP configuration file</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  className="font-mono h-[500px] resize-none"
                  value={phpIni}
                  onChange={(e) => setPhpIni(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleRestartPHP}>
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
          
          {/* PHP Info Tab */}
          <TabsContent value="phpinfo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSearch className="w-5 h-5 text-primary" />
                  PHP Information
                </CardTitle>
                <CardDescription>View detailed PHP environment information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto border rounded-md p-4 bg-white dark:bg-gray-900">
                  <div className="prose dark:prose-invert max-w-none">
                    <h2 className="mb-4 text-xl font-bold text-center text-primary border-b pb-2">PHP 8.2.7</h2>
                    
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <td className="px-4 py-2 font-semibold">PHP Version</td>
                          <td className="px-4 py-2">8.2.7</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-semibold">System</td>
                          <td className="px-4 py-2">Linux / x86_64</td>
                        </tr>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <td className="px-4 py-2 font-semibold">Build Date</td>
                          <td className="px-4 py-2">Jun 12 2023 09:45:01</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-semibold">Configuration File</td>
                          <td className="px-4 py-2">/etc/php/8.2/fpm/php.ini</td>
                        </tr>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <td className="px-4 py-2 font-semibold">Server API</td>
                          <td className="px-4 py-2">FPM/FastCGI</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-semibold">Memory Limit</td>
                          <td className="px-4 py-2">128M</td>
                        </tr>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <td className="px-4 py-2 font-semibold">Max Execution Time</td>
                          <td className="px-4 py-2">30 seconds</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-semibold">Upload Max Filesize</td>
                          <td className="px-4 py-2">2M</td>
                        </tr>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <td className="px-4 py-2 font-semibold">Post Max Size</td>
                          <td className="px-4 py-2">8M</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-semibold">OPcache</td>
                          <td className="px-4 py-2">Enabled</td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <h3 className="mt-6 mb-3 text-lg font-semibold">Loaded Extensions</h3>
                    <div className="flex flex-wrap gap-2">
                      {modules
                        .filter(module => module.status)
                        .map(module => (
                          <div 
                            key={module.name}
                            className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                          >
                            {module.name}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default PHP;
