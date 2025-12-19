import { tryCatch } from "../utils/tryCatch.js";
import { AppError } from "../utils/AppError.js";
import { createSlotService, getSlots } from "../services/slotService.js";
// Create Slot
export const createSlot = tryCatch(async function (req, res, next) {
    const mentorId = req.user?.id;
    if (!mentorId)
        throw new AppError("You are not logged in.Please Logg in", 401);
    const slot = createSlotService(req.body, mentorId);
    return res.status(201).json({
        status: "success",
        message: "Slot created successfully",
        slot,
    });
});
//Get All Slots for mentors;
export const getAllSlots = tryCatch(async function (req, res, next) {
    const { mentorId } = req.params;
    const slots = await getSlots(mentorId);
    return res.status(200).json({
        status: "sucess",
        slots,
    });
});
