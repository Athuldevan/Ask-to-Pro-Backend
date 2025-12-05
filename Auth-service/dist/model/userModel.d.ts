import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    image: string;
    isPremium: boolean;
    role: "user" | "admin";
    chatMessageCount: number;
    passwordResetToken?: string | undefined;
    passwordResetExpires?: Date;
    verifyPassword(enteredPassword: string): Promise<Boolean>;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IUser>;
export default User;
//# sourceMappingURL=userModel.d.ts.map