import User from "../model/userModel";
import { AppError } from "../utils/AppError";
export const editProfileService = async function (id, role, name) {
    const user = await User.findOneAndUpdate({ id, role }, { name });
    if (!user) {
        throw new AppError("No such user  profile is found", 400);
    }
    return user;
};
//# sourceMappingURL=profil.Service.js.map