import type { NextFunction, Response, Request } from "express";
import { tryCatch } from "../utils/tryCatch";
import { AuthRequest } from "../middleware/ProtectMiddleware";
import { AppError } from "../utils/AppError";
import Mentor from "../model/mentorModel";
import {
  createMentor,
  editMentorProfileService,
  getAllApprovedMentorService,
  getSingleMentorById,
} from "../services/mentor.service";
import { JwtPayload } from "jsonwebtoken";

// Get Profile
export const createMentorProfile = tryCatch(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", 401);

    const mentor = await createMentor(userId, req.body);

    return res.status(201).json({
      status: "success",
      message: "Mentor profile created successfully",
      mentor,
    });
  },
);

//Get Pending Mentotrs
export const getPendingMentors = tryCatch(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const mentors = await Mentor.findOne({ verificationStatus: "pending" });
  return res.status(200).json({
    status: "success",
    mentors,
  });
});

//Approve Mentor;
export const approveMentors = tryCatch(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id, status } = req.params;
  const mentor = await Mentor.findByIdAndUpdate(
    { _id: id },
    {
      verificationStatus: "approved",
      isVerified: true,
    },
    { new: true },
  );
  if (!mentor) {
    throw new AppError("No Mentor found", 404);
  }

  return res.status(200).json({
    status: "success",
    message: "Approved mentor ",
    mentor,
  });
});

//Reject Mentor;
export const rejectMentor = tryCatch(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  const mentor = await Mentor.findByIdAndUpdate(
    id,
    {
      verificationStatus: "rejected",
      isVerified: false,
    },
    { new: true },
  );

  if (!mentor) {
    throw new AppError("No Mentort Found", 404);
  }
  return res.status(200).json({
    status: "sucess",
    message: "Mentor Rejected",
    mentor,
  });
});

//Get all Mentors
export const getApprovedMentors = tryCatch(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const mentors = await getAllApprovedMentorService();
  return res.status(200).json({
    status: "success",
    mentors,
  });
});

export const getMentor = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const mentor = await getSingleMentorById(id);
    if (!mentor) throw new AppError("No Mentor found", 404);
    return res.status(200).json({
      status: "success",
      mentor,
    });
  },
);

export const getMentorProfile = tryCatch(async function (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const { id: userId, role } = req.user as JwtPayload;
  if (role != "mentor") throw new AppError("Not a Mentor", 403);
  const mentor = await Mentor.findOne({ userId });
  if (!mentor) throw new AppError("Mentor Profile Not Found", 404);
  return res.status(200).json({
    status: "success",
    mentor,
  });
});

export const editMentorProfile = async (req: AuthRequest, res: Response) => {
  const { id } = req?.user as JwtPayload;
  
  const mentor = await editMentorProfileService(id, req.body);
  if (!mentor) throw new AppError("No Such  Mentor found", 404);
  return res.status(200).json({
    status: "success",
    mentor,
    message: "successfully edited the profile",
  });
};
