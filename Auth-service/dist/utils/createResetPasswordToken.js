import crypto from "crypto";
export const createResetPasswordToken = (userId) => {
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    const payload = `${userId}.${expires}`;
    const signature = crypto
        .createHmac("sha256", "bvhjsbgvhjsvhjib468b")
        .update(payload)
        .digest("hex");
    console.log(signature);
    return `${payload}.${signature}`;
};
//# sourceMappingURL=createResetPasswordToken.js.map