import { editProfileService } from "../service/profileService.js";
export const editProfile = async function (req, res, next) {
    const { id, role } = req.user;
    console.log(id, "JWT");
    const { name, phone } = req.body;
    console.log(req.body.formData);
    const user = await editProfileService(id, name);
    return res.status(200).json({
        status: "sucess",
        user,
    });
};
//# sourceMappingURL=profileController.js.map