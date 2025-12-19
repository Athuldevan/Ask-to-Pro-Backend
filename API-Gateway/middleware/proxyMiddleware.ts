import { createProxyMiddleware, Options } from "http-proxy-middleware";
import type { Request, Response, NextFunction } from "express";
import type { IncomingMessage, ServerResponse } from "http";
import { getServiceByPath, services } from "../config/services";
import type { AuthRequest } from "./jwtMiddleware";

export const createProxy = (serviceTarget: string, servicePath: string) => {
  const proxyOptions: Options = {
    target: serviceTarget,
    changeOrigin: true,
    pathRewrite: (path: string) => {
      // Keep the path as-is (services expect full paths)
      return path;
    },
    on: {
      proxyReq: (proxyReq, req: IncomingMessage) => {
        // Forward original headers including Authorization and cookies
        // The Authorization header is already in the request from the client
        // If JWT was validated, we can optionally forward user info as headers
        const expressReq = req as unknown as AuthRequest;
        if (expressReq.user) {
          proxyReq.setHeader("X-User-Id", expressReq.user.id);
          proxyReq.setHeader("X-User-Role", expressReq.user.role);
        }
        
        // Log proxy request
        const method = (req as any).method || "UNKNOWN";
        const url = (req as any).url || req.url || "";
        console.log(
          `[PROXY] ${method} ${url} -> ${serviceTarget}${url}`
        );
      },
      error: (err: Error, req: IncomingMessage, res: ServerResponse<IncomingMessage> | any) => {
        const url = (req as any).url || req.url || "unknown";
        console.error(`[PROXY ERROR] ${url}:`, err.message);
        if (res && typeof res.status === 'function' && !res.headersSent) {
          res.status(502).json({
            status: "error",
            message: `Service unavailable: ${serviceTarget}`,
          });
        } else if (res && typeof res.writeHead === 'function' && !res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: "error",
            message: `Service unavailable: ${serviceTarget}`,
          }));
        }
      },
    },
    // Preserve cookie headers
    cookieDomainRewrite: "",
    cookiePathRewrite: "",
  };

  return createProxyMiddleware(proxyOptions);
};

// Create proxy middleware for each service
export const proxyHandlers = new Map<string, ReturnType<typeof createProxy>>();

services.forEach((service) => {
  proxyHandlers.set(service.path, createProxy(service.target, service.path));
});

export const handleProxy = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const service = getServiceByPath(req.path);

  if (!service) {
    res.status(404).json({
      status: "error",
      message: `No service found for path: ${req.path}`,
    });
    return;
  }

  const proxyHandler = proxyHandlers.get(service.path);
  if (!proxyHandler) {
    res.status(502).json({
      status: "error",
      message: `Proxy handler not configured for: ${service.path}`,
    });
    return;
  }

  proxyHandler(req, res, next);
};

