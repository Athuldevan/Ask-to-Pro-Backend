"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSlots = exports.createSlotService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mentorModel_1 = __importDefault(require("../model/mentorModel"));
const slotModel_1 = __importDefault(require("../model/slotModel"));
const AppError_1 = require("../utils/AppError");
const time_1 = require("../utils/time");
const createSlotService = async function (data, mentorId) {
    const { date, startTime, endTime } = data;
    if (!date || !startTime || !endTime) {
        throw new AppError_1.AppError("Please Provide date and time", 400);
    }
    // ✅ enforce HH:mm format
    // normalize times (allows 1:00, 01:00, 13:00)
    const normalizedStart = (0, time_1.normalizeTime)(startTime);
    const normalizedEnd = (0, time_1.normalizeTime)(endTime);
    if (normalizedStart >= normalizedEnd) {
        throw new AppError_1.AppError("startTime must be before endTime", 400);
    }
    if (startTime >= endTime) {
        throw new AppError_1.AppError("startTime must be before endTime", 400);
    }
    // ✅ ensure mentor exists & is approved
    const mentor = await mentorModel_1.default.findOne({
        userId: new mongoose_1.default.Types.ObjectId(mentorId),
        verificationStatus: "approved",
    });
    if (!mentor) {
        throw new AppError_1.AppError("Mentor not approved or does not exist", 403);
    }
    const mentorObjectId = mentor._id;
    // ✅ prevent overlapping slots
    const existing = await slotModel_1.default.findOne({
        mentorId: mentorObjectId,
        date,
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });
    if (existing) {
        throw new AppError_1.AppError("Slot overlaps with existing slot", 400);
    }
    const slot = await slotModel_1.default.create({
        mentorId: mentorObjectId,
        date,
        startTime,
        endTime,
    });
};
exports.createSlotService = createSlotService;
// Get all Slots
const getSlots = async function (mentorId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const slots = await slotModel_1.default.find({
        mentorId: new mongoose_1.default.Types.ObjectId(mentorId),
        isBooked: false,
        // date: { $gte: today },
    })
        .select("date startTime endTime")
        .sort({ date: 1, startTime: 1 });
    return slots;
};
exports.getSlots = getSlots;
