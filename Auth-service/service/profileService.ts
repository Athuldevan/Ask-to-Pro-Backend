import User from "../model/userModel.js";
import { AppError } from "../utils/AppError.js";

export const editProfileService = async function (
  id: string,
  role: string,
  name: string
) {
  const user = await User.findOneAndUpdate({ id, role }, { name });
  // if (!user) {
  //   throw new AppError("No such user  profile is found", 400);
  // }

  return user;
};
