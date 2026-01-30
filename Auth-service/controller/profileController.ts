import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { editProfileService } from "../service/profileService.js";
import { Types } from "mongoose";
import { AppError } from "../utils/AppError.js";

export const editProfile = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id, role } = req.user as JwtPayload;
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid ID found", 400);
  }
  const { name, phone } = req.body;
  console.log(req.body.formData);
  const user = await editProfileService(id, name);
  return res.status(200).json({
    status: "success",
    user,
  });
};
