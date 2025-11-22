import { AppError } from "../utils/AppError.js";
import type { Response, Request } from "express";
import { verifyOtp } from "../service/authService.js";
import { sendOtp } from "../utils/otp.js";
import { client } from "../config/redis.js";
import User from "../model/userModel.js";

export const register = async function (req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    throw new AppError(`Please provide all credentials`, 400);
  const otp = await sendOtp(email);

  // storing the otp in redis for few mins 5 minuted
  await client.set(`otp:${email}`, otp, { EX: 300 });
  await client.set(
    `registerData:${email}`,
    JSON.stringify({ name, email, password }),
    {
      EX: 600,
    }
  );

  return res.status(201).json({
    status: "sucess",
    message: "OTP Sent, Email Verification step is pending",
  });
};

export const verifyUser = async function (req: Request, res: Response) {
  const { enteredOtp, email } = req.body;
  if (!enteredOtp) throw new AppError(`Missing OTP filed`, 400);

  const isValidOtp = await verifyOtp(enteredOtp, email);
  const data = await client.get(`registerData:${email}`);
  if (!data)
    throw new AppError(
      "Registration data expired. Please register again.",
      400
    );

  const { name, password } = JSON.parse(data);
  const user = await User.create({
    name,
    email,
    password,
  });

  await client.del(`otp:${email}`);
  await client.del(`registerData:${email}`);

  return res.status(200).json({
    status: "success",
    message: "Sucessfully Registered",
    user,
  });
};
