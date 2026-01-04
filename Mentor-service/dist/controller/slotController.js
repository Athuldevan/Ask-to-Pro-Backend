"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSlots = exports.createSlot = void 0;
const tryCatch_1 = require("../utils/tryCatch");
const AppError_1 = require("../utils/AppError");
const slotService_1 = require("../services/slotService");
// Create Slot
exports.createSlot = (0, tryCatch_1.tryCatch)(async function (req, res, next) {
    const mentorId = req.user?.id;
    if (!mentorId)
        throw new AppError_1.AppError("You are not logged in.Please Logg in", 401);
    const slot = (0, slotService_1.createSlotService)(req.body, mentorId);
    return res.status(201).json({
        status: "success",
        message: "Slot created successfully",
        slot,
    });
});
//Get All Slots for mentors;
exports.getAllSlots = (0, tryCatch_1.tryCatch)(async function (req, res, next) {
    const { mentorId } = req.params;
    const slots = await (0, slotService_1.getSlots)(mentorId);
    return res.status(200).json({
        status: "sucess",
        slots,
    });
});
