export interface ServiceConfig {
  name: string;
  target: string;
  path: string;
}

export const services: ServiceConfig[] = [
  {
    name: "auth-service",
    target: process.env.AUTH_SERVICE_URL || "http://auth-service:8080",
    path: "/api/v1/auth",   
  },
  {
    name: "mentor-service",
    target: process.env.MENTOR_SERVICE_URL || "http://mentor-service:8080",
    path: "/api/v1/mentor",
  },
  {
    name: "admin-service",
    target: process.env.MENTOR_SERVICE_URL || "http://mentor-service:8080",
    path: "/api/v1/admin",
  },
];

export const getServiceByPath = (path: string): ServiceConfig | undefined => {
  return services.find((service) => path.startsWith(service.path));
};

