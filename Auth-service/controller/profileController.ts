import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { editProfileService } from "../service/profileService.js";

export const editProfile = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id, role } = req.user as JwtPayload;
  console.log(id, "JWT");
  const { name, phone } = req.body;
  console.log(req.body.formData);
  const user = await editProfileService(id, name);
  return res.status(200).json({
    status: "sucess",
    user,
  });
};

