import { editStudentProfileService } from "../service/profile.service.js";
export const editStudentProfile = async function (req, res) {
    const { id } = req?.user;
    const body = req?.body;
    const mentor = await editStudentProfileService(id, req.body);
    return res.status(200).json({
        status: "success",
        message: "Successfully edited Profile",
        mentor,
    });
};
//# sourceMappingURL=profile.controller.js.map