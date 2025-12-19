import { createProxyMiddleware, Options } from "http-proxy-middleware";
import type { Request, Response, NextFunction } from "express";
import type { IncomingMessage, ServerResponse } from "http";
import { getServiceByPath, services } from "../config/services";
import type { AuthRequest } from "./jwtMiddleware";

export const createProxy = (serviceTarget: string, servicePath: string) => {
  const proxyOptions: Options = {
    target: serviceTarget,
    changeOrigin: true,
    selfHandleResponse: false, // 🔥 REQUIRED
    pathRewrite: (path: string) => path,

    on: {
      proxyReq: (proxyReq, req: IncomingMessage) => {
        const expressReq = req as any;

        // Re-send body
        if (expressReq.body && Object.keys(expressReq.body).length) {
          const bodyData = JSON.stringify(expressReq.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }

        if (expressReq.user) {
          proxyReq.setHeader("X-User-Id", expressReq.user.id);
          proxyReq.setHeader("X-User-Role", expressReq.user.role);
        }
      },

      error: (err, req, res: any) => {
        if (!res.headersSent) {
          res.status(502).json({
            status: "error",
            message: "Upstream service unavailable",
          });
        }
      },
    },
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
