import { AppError } from "../utils/AppError.js";
import { response, } from "express";
import { requestResetPassword, verifyOtp } from "../service/authService.js";
import { sendOtp } from "../utils/otp.js";
import { client } from "../config/redis.js";
import User from "../model/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { generateAcessToken, generateRefreshToken } from "../utils/token.js";
import RefreshToken, {} from "../model/refreshTokenModel.js";
// -------------------------- REGISTER --------------------------------
export const register = async function (req, res) {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
        throw new AppError(`Please provide all credentials`, 400);
    const otp = await sendOtp(email);
    // storing the otp in redis for few mins 5 minuted
    await client.set(`otp:${email}`, otp, { EX: 300 });
    await client.set(`registerData:${email}`, JSON.stringify({ name, email, password, role }), {
        EX: 600,
    });
    return res.status(201).json({
        status: "sucess",
        message: "OTP Sent, Email Verification step is pending",
    });
};
// Verifiying User
export const verifyUser = catchAsync(async function (req, res, next) {
    const { enteredOtp, email } = req.body;
    if (!enteredOtp || !email)
        throw new AppError(`Missing fileds otp or email`, 400);
    const isValidOtp = await verifyOtp(enteredOtp, email);
    if (!isValidOtp)
        throw new AppError("Invalid Otp", 400);
    const data = await client.get(`registerData:${email}`);
    if (!data)
        throw new AppError("Registration data expired. Please register again.", 400);
    const { name, password, role } = JSON.parse(data);
    const user = await User.create({
        name,
        email,
        password,
        role,
    });
    await client.del(`otp:${email}`);
    await client.del(`registerData:${email}`);
    return res.status(200).json({
        status: "success",
        message: "Sucessfully Registered",
        user,
    });
});
// -------------------------- LOGIN ---------------------------------
export const login = catchAsync(async function (req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError("Please provide all the credentials ", 400);
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user)
        throw new AppError("No such user found", 404);
    const isPassowrdValid = await user.verifyPassword(password);
    if (!isPassowrdValid)
        throw new AppError("Invalid password", 400);
    const accessToken = await generateAcessToken(user._id, user.role);
    const refreshToken = await generateRefreshToken(user._id, user?.role);
    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7 days
        userAgent: req.headers["user-agent"] || undefined,
        ip: req.ip ?? undefined,
        revoked: false,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(200).json({
        status: "sucess",
        message: "You are sucessfully Logged in ",
        user,
        accessToken,
    });
});
// -------------------------- REFRESH TOKEN CONTROLLR --------------------------
export const refresh = catchAsync(async function (req, res) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
        throw new AppError("No Refresh Token found", 401);
    // Finding in DB
    const existingToken = await RefreshToken.findOne({ token: refreshToken });
    if (!existingToken)
        throw new AppError("Invalid refresh token", 401);
    if (existingToken.revoked)
        throw new AppError("Token revoked", 401);
    if (existingToken.expiresAt.getTime() < Date.now())
        throw new AppError("Refresh Token Expired", 401);
    // GEtting the user;
    const user = await User.findById(existingToken.user);
    if (!user)
        throw new AppError("User not found", 401);
    // Generating a new Token
    const accessToken = await generateAcessToken(user._id, user?.role);
    const newRefreshToken = await generateRefreshToken(user._id, user?.role);
    // Rotation
    existingToken.revoked = true;
    await existingToken.save();
    await RefreshToken.create({
        user: user._id,
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(200).json({
        status: "sucess",
        message: "Sucessfully logged in ",
        accessToken,
    });
});
// -------------------------- LOGOUT ------------------------------
export const logout = catchAsync(async function (req, res) {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
        await RefreshToken.updateOne({ token: refreshToken }, { revoked: true });
    }
    // Clearing the cookie
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    res.status(200).json({
        status: "sucess",
        mesage: "Sucessfully Logged Out",
    });
});
// ------------------ FORGOT PASSWORD --------------
export const forgotPassword = catchAsync(async function (req, res, next) {
    const { email } = req.body;
    if (!email) {
        return next(new AppError("Email is required", 400));
    }
    await requestResetPassword(email);
    res.json({
        status: "sucess",
        message: "Email sent sucessfully",
    });
});
export const resetPassword = catchAsync(async function (req, res, next) {
    const { token } = req.params;
    const { password } = req.body;
    if (!token)
        throw new AppError("Token is required", 400);
    if (!password)
        throw new AppError("Please Enter Your new password", 400);
    const user = await User.findOne({ passwordResetToken: token });
    if (!user)
        throw new AppError("Token is Expired", 400);
    //Setting the new Password;
    user.password = password;
    user.passwordResetToken = undefined;
    await user.save();
    res.status(200).json({
        status: "sucess",
        message: "Password reset sucessfull.You can now log in with your new password",
    });
});
//See the profile
export const viewProfile = catchAsync(async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId)
        throw new AppError("You are not logged in.Please Log in first.", 401);
    const user = await User.findById(userId);
    return res.status(200).json({
        status: "sucess",
        user,
    });
});
//# sourceMappingURL=authController.js.map