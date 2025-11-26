import { sendMail } from "../config/nodemailer.js";
import { client } from "../config/redis.js";
import User, {} from "../model/userModel.js";
import { AppError } from "../utils/AppError.js";
import { createResetPasswordToken } from "../utils/createResetPasswordToken.js";
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
export const requestResetPassword = async function (email) {
    if (!email) {
        console.log("`Emial is required");
    }
    const user = await User.findOne({ email });
    if (!user)
        return;
    const resetPasswordToken = createResetPasswordToken(user?._id.toString());
    //saving reset token in password
    user.passwordResetToken = resetPasswordToken;
    await user.save({ validateBeforeSave: false });
    const resetURL = `http://localhost:3000/reset-password/${resetPasswordToken}`;
    await sendMail({
        to: user.email,
        subject: "Password Reset",
        text: "Click to reset Password" + resetURL,
    });
};
//# sourceMappingURL=authService.js.map