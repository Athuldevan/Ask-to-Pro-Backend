import crypto from "crypto";

export const createResetPasswordToken = (userId: string) => {
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  const payload = `${userId}.${expires}`;

  const signature = crypto
    .createHmac("sha256", "bvhjsbgvhjsvhjib468b")
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
};
