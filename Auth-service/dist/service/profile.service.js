import mongoose, { Types } from "mongoose";
import User from "../model/userModel.js";
import { AppError } from "../utils/AppError.js";
export const editStudentProfileService = async function (id, body) {
    const mentor = await User.findOneAndUpdate({ _id: id }, { body }, { new: true });
    if (!mentor) {
        throw new AppError("No such Mentor found", 404);
    }
    return mentor;
};
//# sourceMappingURL=profile.service.js.map