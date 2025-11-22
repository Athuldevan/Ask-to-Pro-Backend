import { client } from "../config/redis.js";
import User, { type IUser } from "../model/userModel.js";
import { AppError } from "../utils/AppError.js";

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
  if (enteredOtp === storedOtp) {
    return true;
  }
}
