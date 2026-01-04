"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = void 0;
const AppError_1 = require("../utils/AppError");
const restrictTo = (...roles) => {
    return async function (req, res, next) {
        const role = req.user?.role;
        console.log(req.user?.ole);
        console.log(role);
        if (!role || !req.user)
            throw new AppError_1.AppError("Please Login", 401);
        if (!roles.includes(role)) {
            throw new AppError_1.AppError(`You Dont have permission to for this action`, 403);
        }
        ;
        next();
    };
};
exports.restrictTo = restrictTo;
