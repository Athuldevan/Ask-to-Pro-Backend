import { ErrorCodes } from "../constants/error";

export class AppError extends Error {
  statusCode: number;
  status: "fail" | "error";
  isOperational: boolean;
  code: string;

  constructor(
    message: string,
    statusCode: number,
    code: string = ErrorCodes.SERVER_ERROR,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }

  // Static factory methods for common errors
  static badRequest(message: string, code?: string): AppError {
    return new AppError(message, 400, code || ErrorCodes.BAD_REQUEST);
  }

  static unauthorized(message: string, code?: string): AppError {
    return new AppError(message, 401, code || ErrorCodes.UNAUTHORIZED);
  }

  static forbidden(message: string, code?: string): AppError {
    return new AppError(message, 403, code || ErrorCodes.FORBIDDEN);
  }

  static notFound(message: string, code?: string): AppError {
    return new AppError(message, 404, code || ErrorCodes.NOT_FOUND);
  }

  static conflict(message: string, code?: string): AppError {
    return new AppError(message, 409, code || ErrorCodes.CONFLICT);
  }

  static validationError(message: string): AppError {
    return new AppError(message, 400, ErrorCodes.VALIDATION_ERROR);
  }

  static databaseError(message: string): AppError {
    return new AppError(message, 500, ErrorCodes.DATABASE_ERROR);
  }

  static serverError(message: string): AppError {
    return new AppError(message, 500, ErrorCodes.SERVER_ERROR);
  }
}
