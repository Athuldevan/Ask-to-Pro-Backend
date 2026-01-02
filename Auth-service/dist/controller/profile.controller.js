import { editProfileService } from "../service/profil.Service";
export const editProfile = async function (req, res, next) {
    const { id, role } = req.user;
    const { name, phone } = req.body;
    const user = editProfileService(id, role, name);
    return res.status(200).json({
        status: "sucess",
        user,
    });
};
//# sourceMappingURL=profile.controller.js.map