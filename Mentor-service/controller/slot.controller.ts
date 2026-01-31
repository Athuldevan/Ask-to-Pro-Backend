import type { NextFunction, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../middleware/ProtectMiddleware";

import { createSlotService, getSlots } from "../services/slot.service";

// Create Slot
export const createSlot = tryCatch(async function (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
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
export const getAllSlots = tryCatch(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { mentorId } = req.params;
  const slots = await getSlots(mentorId);

  return res.status(200).json({
    status: "sucess",
    slots,
  });
});
