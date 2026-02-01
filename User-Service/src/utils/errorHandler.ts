import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { AppError } from "./AppError";
import { ErrorCodes } from "../constants/error";


// Types
interface ErrorResponse {
  status: "error" | "fail";
  message: string;
  code?: typeof ErrorCodes;
  errors?: string[];
  field?: string;
  timestamp?: string;
  path?: string;
  requestId?: string;
  action?: string;
  retryAfter?: number;
  stack?: string;
}

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  code?: string | number;
  keyValue?: Record<string, any>;
  path?: string;
  value?: any;
  errors?: any;
  isJoi?: boolean;
  details?: any[];
  isOperational?: boolean;
}

// HTTP Status Constants
const HttpStatus = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// System Error Mapping
const SYSTEM_ERROR_MAP: Record<
  string,
  { status: number; message: string; code: string }
> = {
  ECONNREFUSED: {
    status: HttpStatus.SERVICE_UNAVAILABLE,
    message: "Service temporarily unavailable. Please try again later.",
    code: ErrorCodes.EXTERNAL_SERVICE_ERROR,
  },
  ETIMEDOUT: {
    status: HttpStatus.GATEWAY_TIMEOUT,
    message: "Request timeout. Please try again.",
    code: ErrorCodes.TIMEOUT,
  },
  ECONNRESET: {
    status: HttpStatus.BAD_GATEWAY,
    message: "Connection error. Please try again.",
    code: ErrorCodes.EXTERNAL_SERVICE_ERROR,
  },
  ENOTFOUND: {
    status: HttpStatus.BAD_GATEWAY,
    message: "Service not available. Please try again later.",
    code: ErrorCodes.EXTERNAL_SERVICE_ERROR,
  },
};

// Logger (replace with Winston/Pino in production)
const logger = {
  error: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      level: "error",
      timestamp,
      message,
      ...meta,
    };

    // In production, send to external logging service
    if (process.env.NODE_ENV === "production") {
      // Send to logging service (e.g., LogRocket, Datadog, etc.)
      console.error(JSON.stringify(logEntry));
    } else {
      console.error(message, meta);
    }
  },
};

// Sanitize error message for production
const sanitizeErrorMessage = (
  message: string,
  isDevelopment: boolean
): string => {
  if (isDevelopment) return message;

  // Remove sensitive patterns
  const patterns = [
    /\/([a-zA-Z0-9_-]+)@([a-zA-Z0-9_-]+)/g, // Email-like patterns
    /password[s]?\s*[:=]\s*['"]?[^'"\s]+/gi, // Password patterns
    /api[_-]?key[s]?\s*[:=]\s*['"]?[^'"\s]+/gi, // API key patterns
    /token[s]?\s*[:=]\s*['"]?[^'"\s]+/gi, // Token patterns
  ];

  let sanitized = message;
  patterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "[REDACTED]");
  });

  return sanitized;
};

// Main Error Handler
const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const requestId =
    (req as any).id ||
    `${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;

  // Log error with context
  logger.error("Error occurred", {
    requestId,
    path: req.path,
    method: req.method,
    query: req.query,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code,
    },
    // userId: (req as AuthRequest).user?.userId,
  });

  // Base response structure
  const baseResponse: ErrorResponse = {
    status: "error",
    message: "An unexpected error occurred",
    timestamp: new Date().toISOString(),
    path: req.path,
    requestId,
  };

  // Custom App Error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ...baseResponse,
      status: err.status as "error" | "fail",
      message: sanitizeErrorMessage(err.message, isDevelopment),
      code: err.code || ErrorCodes.SERVER_ERROR,
    });
  }

  // Mongoose ValidationError
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    return res.status(HttpStatus.BAD_REQUEST).json({
      ...baseResponse,
      message:
        errors.length === 1
          ? errors[0]
          : "Validation failed. Please check your input.",
      code: ErrorCodes.VALIDATION_ERROR,
      errors: isDevelopment ? errors : undefined,
      action: "Please review and correct the highlighted fields",
    });
  }

  // Mongoose CastError
  if (err instanceof mongoose.Error.CastError) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      ...baseResponse,
      message: "Invalid data format provided",
      code: ErrorCodes.CAST_ERROR,
      field: err.path,
      errors: isDevelopment
        ? [`Invalid value for ${err.path}: ${err.value}`]
        : undefined,
      action: "Please provide valid data format",
    });
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(HttpStatus.CONFLICT).json({
      ...baseResponse,
      message: `This ${field} is already in use`,
      code: ErrorCodes.DUPLICATE_KEY,
      field,
      action: `Please use a different ${field}`,
    });
  }

  // MongoDB Network Errors
  if (err.name === "MongoNetworkError" || err.name === "MongoServerError") {
    return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
      ...baseResponse,
      message: "Database service temporarily unavailable",
      code: ErrorCodes.DATABASE_ERROR,
      action: "Please try again in a few moments",
      retryAfter: 30, // seconds
    });
  }

  // Joi Validation Error
  if (err.isJoi || err.name === "ValidationError") {
    const details = err.details || [];
    const errors = details.map((d: any) => d.message.replace(/"/g, ""));
    return res.status(HttpStatus.BAD_REQUEST).json({
      ...baseResponse,
      message: errors.length === 1 ? errors[0] : "Validation failed",
      code: ErrorCodes.VALIDATION_ERROR,
      errors: isDevelopment ? errors : undefined,
      action: "Please correct the validation errors and try again",
    });
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      ...baseResponse,
      message: "Authentication failed",
      code: ErrorCodes.JWT_INVALID,
      action: "Please login again",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      ...baseResponse,
      message: "Session expired",
      code: ErrorCodes.JWT_EXPIRED,
      action: "Please login to continue",
    });
  }

  // Syntax Error (JSON parsing)
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      ...baseResponse,
      message: "Invalid request format",
      code: ErrorCodes.VALIDATION_ERROR,
      action: "Please check your request format",
    });
  }

  // Rate Limiting Error
  if (
    err.name === "TooManyRequestsError" ||
    err.code === "RATE_LIMIT_EXCEEDED"
  ) {
    return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
      ...baseResponse,
      message: "Too many requests",
      code: ErrorCodes.RATE_LIMIT,
      action: "Please slow down and try again later",
      retryAfter: 60, // seconds
    });
  }

  // Payload Too Large
  if (err.code === "LIMIT_FILE_SIZE" || err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
      ...baseResponse,
      message: "File size too large",
      code: ErrorCodes.PAYLOAD_TOO_LARGE,
      action: "Please upload a smaller file",
    });
  }

  // System/Network Errors
  if (typeof err.code === "string" && SYSTEM_ERROR_MAP[err.code]) {
    const errorInfo = SYSTEM_ERROR_MAP[err.code];
    return res.status(errorInfo.status).json({
      ...baseResponse,
      message: errorInfo.message,
      code: errorInfo.code,
      action: "Please try again later",
      retryAfter: 30,
    });
  }

  // Default 500 Error - Unknown errors
  const isOperationalError = err.isOperational || false;


  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    ...baseResponse,
    message: isDevelopment
      ? err.message || "Something went wrong"
      : "An unexpected error occurred. Please try again later.",
    code: ErrorCodes.SERVER_ERROR,
    action: "If this problem persists, please contact support",
    stack: isDevelopment ? err.stack : undefined,
  });
};

export default errorHandler;