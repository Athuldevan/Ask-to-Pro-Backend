import { sendMail } from "../config/nodemailer.js";
import { client } from "../config/redis.js";
import User, { type IUser } from "../model/userModel.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { createResetPasswordToken } from "../utils/createResetPasswordToken.js";

export async function createUser(
  name: string,
  email: string,
  password: string
) {
  const data = await User.create({
    name,
    email,
    password,
  });
  return data;
}

export async function verifyOtp(enteredOtp: string, email: string) {
  const storedOtp = await client.get(`otp:${email}`);
  if (!storedOtp) throw new AppError(`The Otp Expired`, 400);
  if (enteredOtp !== storedOtp) throw new AppError(`Invalid Otp`, 400);
  return true;
}

export const requestResetPassword = async function (email: string) {
  if (!email) {
    console.log("`Emial is required");
  }
  const user = await User.findOne({ email });
 
  if (!user) return;
  const resetPasswordToken =  createResetPasswordToken(
    user?._id.toString()
  );
  const resetURL = `http://localhost:3000/reset-password/${resetPasswordToken}`;

  await sendMail({
    to: user.email,
    subject: "Password Reset",
    text: "Click to reset Password" + resetURL,
  });
};
