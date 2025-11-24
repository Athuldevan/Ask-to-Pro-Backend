import { type IUser } from "../model/userModel.js";
export declare function createUser(name: string, email: string, password: string): Promise<import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
export declare function verifyOtp(enteredOtp: string, email: string): Promise<boolean>;
export declare const requestResetPassword: (email: string) => Promise<void>;
//# sourceMappingURL=authService.d.ts.map