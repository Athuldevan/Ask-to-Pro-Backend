import { AppError } from "../utils/AppError.js";
import { verifyOtp } from "../service/authService.js";
import { sendOtp } from "../utils/otp.js";
import { client } from "../config/redis.js";
import User from "../model/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { generateAcessToken, generateRefreshToken } from "../utils/token.js";
import RefreshToken from "../model/refreshTokenModel.js";
// -------------------------- REGISTER --------------------------------
export const register = async function (req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        throw new AppError(`Please provide all credentials`, 400);
    const otp = await sendOtp(email);
    // storing the otp in redis for few mins 5 minuted
    await client.set(`otp:${email}`, otp, { EX: 300 });
    await client.set(`registerData:${email}`, JSON.stringify({ name, email, password }), {
        EX: 600,
    });
    return res.status(201).json({
        status: "sucess",
        message: "OTP Sent, Email Verification step is pending",
    });
};
// Verifiying User
export const verifyUser = async function (req, res) {
    const { enteredOtp, email } = req.body;
    if (!enteredOtp || !email)
        throw new AppError(`Missing fileds otp or email`, 400);
    const isValidOtp = await verifyOtp(enteredOtp, email);
    if (!isValidOtp)
        throw new AppError("Invalid Otp", 400);
    const data = await client.get(`registerData:${email}`);
    if (!data)
        throw new AppError("Registration data expired. Please register again.", 400);
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
    const acessToken = await generateAcessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7 days
        userAgent: req.headers["user-agent"],
        ip: req.ip,
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
        acessToken,
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
    const acessToken = await generateAcessToken(user._id);
    const newRefreshToken = await generateRefreshToken(user._id);
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
        acessToken,
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
//# sourceMappingURL=authController.js.map