import mongoose, { Types } from "mongoose";
import User from "../model/userModel.js";
import type { StudentType } from "../types/types.js";
import { AppError } from "../utils/AppError.js";

export const editStudentProfileService = async function (
  id: Types.ObjectId,
  body: StudentType,
) {
  const mentor = await User.findOneAndUpdate(
    { _id: id },
    { body },
    { new: true },
  );
  if (!mentor) {
    throw new AppError("No such Mentor found", 404);
  }
  return mentor;
};
