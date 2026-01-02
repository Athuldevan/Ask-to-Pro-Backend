import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { editProfileService } from "../service/profileService.js";

export const editProfile = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id, role } = req.user as JwtPayload;
  const { name, phone } = req.body;
  const user = editProfileService(id, role, name);
  return res.status(200).json({
    status: "sucess",
    user,
  });
};
