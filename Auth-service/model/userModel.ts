import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isPremium: boolean;
  role: "user" | "admin";
  chatMessageCount: number;

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

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    chatMessageCount: {
      type: Number,
      default: 20,
    },
  },
  { timestamps: true }
);

////////////////////////////////////////////////////////

//hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 6);
  next();
});

//Verify password;
userSchema.methods.verifyPassword =  async  function (enteredPassword: string):Promise<boolean> {
  if (!enteredPassword) throw new AppError(`Password field is missing`, 400);
  return await  bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
