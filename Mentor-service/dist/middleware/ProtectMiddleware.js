"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../utils/AppError");
const tryCatch_1 = require("../utils/tryCatch");
exports.protect = (0, tryCatch_1.tryCatch)(async function (req, res, next) {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new AppError_1.AppError("unAuthorized", 401);
    let token = authHeader.split(" ")[1];
    if (!token)
        throw new AppError_1.AppError("No token found", 401);
    const decoded = jsonwebtoken_1.default.verify(token, "ACESSTOKENSECRET");
    req.user = decoded;
    console.log(req.user, "from  protect middleware ");
    if (!req.user)
        throw new AppError_1.AppError("You are not Logged in Please.Please Login First!!", 401);
    next();
});
