"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mentorRouter_1 = __importDefault(require("./routes/mentorRouter"));
const adminRouter_1 = __importDefault(require("./routes/adminRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS and JWT validation are now handled by API Gateway
// Keeping minimal setup for internal service-to-service communication
app.use(express_1.default.json());
app.use("/api/v1/mentor", mentorRouter_1.default);
app.use("/api/v1/admin", adminRouter_1.default);
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500 || 404;
    err.status = err.status || "error";
    err.data = err.data || null;
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
    });
});
exports.default = app;
