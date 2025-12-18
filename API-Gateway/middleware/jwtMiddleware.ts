import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export interface TokenPayload extends jwt.JwtPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

// Routes that don't require JWT authentication
const publicRoutes = [
  "/api/v1/auth/register",
  "/api/v1/auth/verify",
  "/api/v1/auth/login",
  "/api/v1/auth/logout",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/refresh",
];

// Check if route is public
const isPublicRoute = (path: string): boolean => {
  // Exact match or starts with reset token route
  if (path.startsWith("/api/v1/auth/reset/")) {
    return true;
  }
  return publicRoutes.some(route => path === route || path.startsWith(route + "/"));
};

export const validateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // Skip JWT validation for public routes
  if (isPublicRoute(req.path)) {
    return next();
  }

  // Skip OPTIONS requests (CORS preflight)
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      status: "error",
      message: "Unauthorized - No token provided",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      status: "error",
      message: "Unauthorized - Invalid token format",
    });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || "ACESSTOKENSECRET";

  try {
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    req.user = decoded;

    if (!req.user || !req.user.id) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized - Invalid token payload",
      });
      return;
    }

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized - Invalid or expired token",
      });
      return;
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error during token validation",
    });
  }
};

