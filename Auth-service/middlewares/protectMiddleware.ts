import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

interface TokenPayload extends jwt.JwtPayload {
  _id: string;
}

export const protect = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new AppError("unAuthorized", 401);

  let token = authHeader.split(" ")[1];

  if (!token) throw new AppError("No token found", 401);

  const decoded = jwt.verify(token, "ACESSTOKENSECRET") as TokenPayload;
  req.user = decoded?.id;
  if (!req.user)
    throw new AppError(
      "You are not Logged in Please.Please Login First!!",
      401
    );
  next();
});
