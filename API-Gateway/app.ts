import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { configureCORS } from "./middleware/corsMiddleware.js";
import { validateJWT } from "./middleware/jwtMiddleware.js";
import { requestLogger } from "./middleware/loggingMiddleware.js";
import { handleProxy } from "./middleware/proxyMiddleware.js";

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure CORS
configureCORS(app);

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "API Gateway is healthy",
    timestamp: new Date().toISOString(),
  });
});

// JWT validation middleware (applied before routing)
app.use(validateJWT);

// Proxy requests to appropriate services
app.use(handleProxy);

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Gateway error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler for unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

export default app;

