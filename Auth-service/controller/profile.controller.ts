import type { JwtPayload } from "jsonwebtoken";
import { editStudentProfileService } from "../service/profile.service.js";
import type { AuthRequest } from "../types/request";
import type { Response } from "express";

export const editStudentProfile = async function (
  req: AuthRequest,
  res: Response,
) {
  const { id } = req?.user as JwtPayload;
  const body = req?.body;
  const mentor = await editStudentProfileService(id, req.body);
  return res.status(200).json({
    status: "success",
    message: "Successfully edited Profile",
    mentor,
  });
};
