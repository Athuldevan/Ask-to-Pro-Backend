import mongoose, { Schema, Document, mongo } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  isPremium: boolean;
  role: "user" | "admin" | "mentor";
  chatMessageCount: number;
  passwordResetToken?: string | undefined;
  passwordResetExpires?: Date;

  verifyPassword(enteredPassword: string): Promise<Boolean>;
}
import { AppError } from "../utils/AppError.js";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: false,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
      default: "https://37assets.37signals.com/svn/765-default-avatar.png",
    },

    role: {
      type: String,
      enum: ["user", "admin","mentor"],
    },

    chatMessageCount: {
      type: Number,
      default: 20,
    },

    passwordResetToken: String,
    passwordResetExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

////////////////////////////////////////////////////////

//hash password
userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 6);
});

//Verify password;
userSchema.methods.verifyPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  if (!enteredPassword) throw new AppError(`Password field is missing`, 400);
  return await bcrypt.compare(enteredPassword, this.password);
};

//create resetPassword Token
userSchema.methods.createResetPasswordToken = async function () {
  const raw = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update("raw")
    .digest("hex");
  this.passwordResetExpires = Date.now() + 1000 * 60 * 15; // 15 min
  return raw; // sending this raw token to in email;
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
