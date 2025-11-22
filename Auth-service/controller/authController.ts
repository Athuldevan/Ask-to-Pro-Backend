import { AppError } from "../utils/AppError.js";
import type { Response, Request } from "express";
import { createUser, verifyOtp } from "../service/authService.js";
import { sendOtp } from "../utils/otp.js";
import { client } from "../config/redis.js";

export const register = async function (req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    throw new AppError(`Please provide all credentials`, 400);
  const user = await createUser(name, email, password);
  const otp = await sendOtp(email);
  // storing the otp in redis for few mins 5 minuted
  await client.set(`otp:${email}`, otp, { EX: 300 });
  return res.status(201).json({
    status: 200,
    user,
  });
};

export const verifyUser = async function (req: Request, res: Response) {
  const { enteredOtp, email } = req.body;
  if (!enteredOtp) throw new AppError(`Missing OTP filed`, 400);
  const isValidOtp = await verifyOtp(enteredOtp, email);
  if (isValidOtp) {
    return res.status(200).json({
      status: "success",
      message: "Sucessfully Registered",
    });
  } else {
    throw new AppError("Invalid Otp", 400);
  }
};
