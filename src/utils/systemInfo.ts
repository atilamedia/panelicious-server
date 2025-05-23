
// Utility functions to get real system information
// Note: In a real environment, these would call actual system APIs

export interface ServiceInfo {
  name: string;
  status: "active" | "inactive" | "warning";
  version: string;
  uptime: string;
  pid?: string;
}

// Simulated system calls - in production, these would call actual system APIs
export const getSystemInfo = async (): Promise<{
  services: ServiceInfo[];
  resources: {
    cpu: number;
    memory: number;
    disk: number;
  };
}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // In a real implementation, these would be actual system calls
  const services: ServiceInfo[] = [
    {
      name: "Nginx",
      status: "active",
      version: await getNginxVersion(),
      uptime: await getNginxUptime(),
      pid: "1234"
    },
    {
      name: "PHP-FPM",
      status: "active", 
      version: await getPHPVersion(),
      uptime: await getPHPUptime(),
      pid: "5678"
    },
    {
      name: "MySQL",
      status: "active",
      version: await getMySQLVersion(),
      uptime: await getMySQLUptime(),
      pid: "9012"
    }
  ];

  const resources = {
    cpu: Math.floor(Math.random() * 30) + 20, // 20-50%
    memory: Math.floor(Math.random() * 20) + 40, // 40-60%
    disk: Math.floor(Math.random() * 10) + 55 // 55-65%
  };

  return { services, resources };
};

// Individual service info functions
const getNginxVersion = async (): Promise<string> => {
  // In production: exec('nginx -v 2>&1 | grep -o "nginx/[0-9.]*"')
  return "1.22.1";
};

const getNginxUptime = async (): Promise<string> => {
  // In production: check systemctl status nginx or parse /proc/uptime
  const uptimeHours = Math.floor(Math.random() * 168) + 24; // 1-7 days
  const days = Math.floor(uptimeHours / 24);
  const hours = uptimeHours % 24;
  const minutes = Math.floor(Math.random() * 60);
  return `${days}d ${hours}h ${minutes}m`;
};

const getPHPVersion = async (): Promise<string> => {
  // In production: exec('php -v | head -n 1 | grep -o "PHP [0-9.]*"')
  return "8.2.7";
};

const getPHPUptime = async (): Promise<string> => {
  // In production: check PHP-FPM process start time
  const uptimeHours = Math.floor(Math.random() * 168) + 20;
  const days = Math.floor(uptimeHours / 24);
  const hours = uptimeHours % 24;
  const minutes = Math.floor(Math.random() * 60);
  return `${days}d ${hours}h ${minutes}m`;
};

const getMySQLVersion = async (): Promise<string> => {
  // In production: exec('mysql --version | grep -o "[0-9.]*"')
  return "8.0.33";
};

const getMySQLUptime = async (): Promise<string> => {
  // In production: query MySQL SHOW STATUS LIKE 'Uptime'
  const uptimeHours = Math.floor(Math.random() * 168) + 22;
  const days = Math.floor(uptimeHours / 24);
  const hours = uptimeHours % 24;
  const minutes = Math.floor(Math.random() * 60);
  return `${days}d ${hours}h ${minutes}m`;
};

export const checkServiceStatus = async (serviceName: string): Promise<"active" | "inactive" | "warning"> => {
  // In production: exec(`systemctl is-active ${serviceName}`)
  
  // Simulate occasional service issues
  const rand = Math.random();
  if (rand < 0.05) return "inactive"; // 5% chance inactive
  if (rand < 0.15) return "warning";  // 10% chance warning
  return "active"; // 85% chance active
};
