import mongoose, { mongo } from "mongoose";
import Mentor from "../model/mentorModel";
import Slot from "../model/slotModel";
import { AppError } from "../utils/AppError";
import { normalizeTime } from "../utils/time";

export const createSlotService = async function (data: any, mentorId: string) {
  const { date, startTime, endTime } = data;
  if (!date || !startTime || !endTime) {
    throw new AppError("Please Provide date and time", 400);
  }

  // ✅ enforce HH:mm format
  // normalize times (allows 1:00, 01:00, 13:00)
  const normalizedStart = normalizeTime(startTime);
  const normalizedEnd = normalizeTime(endTime);

  if (normalizedStart >= normalizedEnd) {
    throw new AppError("startTime must be before endTime", 400);
  }

  if (startTime >= endTime) {
    throw new AppError("startTime must be before endTime", 400);
  }

  // ✅ ensure mentor exists & is approved
  const mentor = await Mentor.findOne({
    userId: new mongoose.Types.ObjectId(mentorId),
    verificationStatus: "approved",
  });

  if (!mentor) {
    throw new AppError("Mentor not approved or does not exist", 403);
  }

  const mentorObjectId = mentor._id;

  // ✅ prevent overlapping slots
  const existing = await Slot.findOne({
    mentorId: mentorObjectId,
    date,
    $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
  });

  if (existing) {
    throw new AppError("Slot overlaps with existing slot", 400);
  }

  const slot = await Slot.create({
    mentorId: mentorObjectId,
    date,
    startTime,
    endTime,
  });
};

// Get all Slots
export const getSlots = async function (mentorId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const slots = await Slot.find({
    mentorId: new mongoose.Types.ObjectId(mentorId),
    isBooked: false,
    // date: { $gte: today },
  })
    .select("date startTime endTime")
    .sort({ date: 1, startTime: 1 });

  return slots;
};
