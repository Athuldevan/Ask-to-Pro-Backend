import { sendMail } from "../config/nodemailer.js";
export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
export async function sendOtp(email) {
    const otp = generateOTP();
    await sendMail({
        to: email,
        subject: "Your OTP for AskToPro",
        text: `Your verification OTP is ${otp}. It expires in 5 minutes.`,
    });
    return otp;
}
//# sourceMappingURL=otp.js.map