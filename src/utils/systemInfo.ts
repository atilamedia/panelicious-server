
// Utility functions to get simulated system information
// Note: In a real environment, these would call actual system APIs via a backend

export interface ServiceInfo {
  name: string;
  status: "active" | "inactive" | "warning";
  version: string;
  uptime: string;
  pid?: string;
}

// Simulated system calls - in production, these would call actual system APIs via backend
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
  
  // In a real implementation, these would be actual system calls via backend API
  const services: ServiceInfo[] = [
    {
      name: "Nginx",
      status: await checkServiceStatus("nginx"),
      version: await getNginxVersion(),
      uptime: await getNginxUptime(),
      pid: "1234"
    },
    {
      name: "PHP-FPM",
      status: await checkServiceStatus("php-fpm"), 
      version: await getPHPVersion(),
      uptime: await getPHPUptime(),
      pid: "5678"
    },
    {
      name: "MySQL",
      status: await checkServiceStatus("mysql"),
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

// Individual service info functions - all simulated for browser compatibility
const getNginxVersion = async (): Promise<string> => {
  try {
    // In production, this would call a backend API endpoint
    // that executes: nginx -v 2>&1 | grep -o "nginx/[0-9.]*"
    
    // Return simulated data with some variation
    const versions = ["1.22.1", "1.21.6", "1.20.2"];
    return versions[Math.floor(Math.random() * versions.length)];
  } catch (error) {
    console.error("Error getting Nginx version:", error);
    return "Unknown";
  }
};

const getNginxUptime = async (): Promise<string> => {
  try {
    // In production: call backend API to check systemctl status nginx
    
    // Return simulated uptime data
    const uptimeHours = Math.floor(Math.random() * 168) + 24; // 1-7 days
    const days = Math.floor(uptimeHours / 24);
    const hours = uptimeHours % 24;
    const minutes = Math.floor(Math.random() * 60);
    return `${days}d ${hours}h ${minutes}m`;
  } catch (error) {
    console.error("Error getting Nginx uptime:", error);
    return "Unknown";
  }
};

const getPHPVersion = async (): Promise<string> => {
  try {
    // In production: call backend API to execute php -v
    
    // Return simulated PHP version
    const versions = ["8.2.7", "8.1.12", "8.0.28"];
    return versions[Math.floor(Math.random() * versions.length)];
  } catch (error) {
    console.error("Error getting PHP version:", error);
    return "Unknown";
  }
};

const getPHPUptime = async (): Promise<string> => {
  try {
    // In production: call backend API to check PHP-FPM process start time
    
    // Return simulated uptime
    const uptimeHours = Math.floor(Math.random() * 168) + 20;
    const days = Math.floor(uptimeHours / 24);
    const hours = uptimeHours % 24;
    const minutes = Math.floor(Math.random() * 60);
    return `${days}d ${hours}h ${minutes}m`;
  } catch (error) {
    console.error("Error getting PHP uptime:", error);
    return "Unknown";
  }
};

const getMySQLVersion = async (): Promise<string> => {
  try {
    // In production: call backend API to execute mysql --version
    
    // Return simulated MySQL version
    const versions = ["8.0.33", "8.0.32", "5.7.42"];
    return versions[Math.floor(Math.random() * versions.length)];
  } catch (error) {
    console.error("Error getting MySQL version:", error);
    return "Unknown";
  }
};

const getMySQLUptime = async (): Promise<string> => {
  try {
    // In production: call backend API to query MySQL SHOW STATUS LIKE 'Uptime'
    
    // Return simulated uptime
    const uptimeHours = Math.floor(Math.random() * 168) + 22;
    const days = Math.floor(uptimeHours / 24);
    const hours = uptimeHours % 24;
    const minutes = Math.floor(Math.random() * 60);
    return `${days}d ${hours}h ${minutes}m`;
  } catch (error) {
    console.error("Error getting MySQL uptime:", error);
    return "Unknown";
  }
};

export const checkServiceStatus = async (serviceName: string): Promise<"active" | "inactive" | "warning"> => {
  try {
    // In production: call backend API to execute systemctl is-active ${serviceName}
    
    // Simulate occasional service issues
    const rand = Math.random();
    if (rand < 0.05) return "inactive"; // 5% chance inactive
    if (rand < 0.15) return "warning";  // 10% chance warning
    return "active"; // 85% chance active
  } catch (error) {
    console.error(`Error checking status for ${serviceName}:`, error);
    return "inactive";
  }
};
