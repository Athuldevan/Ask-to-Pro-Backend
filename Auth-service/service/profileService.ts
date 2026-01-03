import type mongoose from "mongoose";
import User from "../model/userModel.js";

export const editProfileService = async function (
  id: mongoose.Schema.Types.ObjectId,
  name: string
) {
  console.log(id, "id");
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { name },
    { new: true }
  );
  console.log(user);
  // if (!user) {
  //   throw new AppError("No such user  profile is found", 400);
  // }

  return user;
};
