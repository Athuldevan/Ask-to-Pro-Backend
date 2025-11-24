import { string } from "joi";
import { client } from "../config/redis.js";
import User, {} from "../model/userModel.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import RefreshToken from "../model/refreshTokenModel.js";
export async function createUser(name, email, password) {
    const data = await User.create({
        name,
        email,
        password,
    });
    return data;
}
export async function verifyOtp(enteredOtp, email) {
    const storedOtp = await client.get(`otp:${email}`);
    if (!storedOtp)
        throw new AppError(`The Otp Expired`, 400);
    if (enteredOtp !== storedOtp)
        throw new AppError(`Invalid Otp`, 400);
    return true;
}
//# sourceMappingURL=authService.js.map