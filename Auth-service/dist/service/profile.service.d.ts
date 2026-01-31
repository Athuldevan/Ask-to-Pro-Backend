import mongoose, { Types } from "mongoose";
import type { StudentType } from "../types/types.js";
export declare const editStudentProfileService: (id: Types.ObjectId, body: StudentType) => Promise<mongoose.Document<unknown, {}, import("../model/userModel.js").IUser, {}, mongoose.DefaultSchemaOptions> & import("../model/userModel.js").IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
//# sourceMappingURL=profile.service.d.ts.map