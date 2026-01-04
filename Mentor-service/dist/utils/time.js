"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTime = normalizeTime;
const AppError_1 = require("./AppError");
function normalizeTime(t) {
    // accepts "1:00", "01:00", "13:00"
    const match = t.match(/^(\d{1,2}):([0-5]\d)$/);
    if (!match) {
        throw new AppError_1.AppError("Time must be H:mm or HH:mm", 400);
    }
    let hour = Number(match[1]);
    const minute = match[2];
    if (hour < 0 || hour > 23) {
        throw new AppError_1.AppError("Hour must be between 0 and 23", 400);
    }
    return `${hour.toString().padStart(2, "0")}:${minute}`;
}
