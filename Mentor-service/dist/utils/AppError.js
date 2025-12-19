export class AppError extends Error {
    constructor(message, statusCode, data = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}
