import { tryCatch } from "../utils/tryCatch.js";
import { AppError } from "../utils/AppError.js";
import Mentor from "../model/mentorModel.js";
import { createMentor, getAllApprovedMentorService, getSingleMentorById } from "../services/mentorService.js";
// Get Profile
export const createMentorProfile = tryCatch(async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new AppError("Unauthorized", 401);
    const mentor = await createMentor(userId, req.body);
    return res.status(201).json({
        status: "success",
        message: "Mentor profile created successfully",
        mentor
    });
});
//Get Pending Mentotrs
export const getPendingMentors = tryCatch(async function (req, res, next) {
    const mentors = await Mentor.findOne({ verificationStatus: 'pending' });
    return res.status(200).json({
        status: "sucess",
        mentors,
    });
});
//Approve Mentor;
export const approveMentors = tryCatch(async function (req, res, next) {
    const { id, status } = req.params;
    const mentor = await Mentor.findByIdAndUpdate({ _id: id }, {
        verificationStatus: "approved",
        isVerified: true,
    }, { new: true });
    if (!mentor) {
        throw new AppError("No Mentor found", 404);
    }
    return res.status(200).json({
        status: 'sucess',
        message: "Approved mentor ",
        mentor,
    });
});
//Reject Mentor;
export const rejectMentor = tryCatch(async function (req, res, next) {
    const { id } = req.params;
    const mentor = await Mentor.findByIdAndUpdate(id, {
        verificationStatus: 'rejected',
        isVerified: false,
    }, { new: true });
    if (!mentor) {
        throw new AppError('No Mentort Found', 404);
    }
    ;
    return res.status(200).json({
        status: "sucess",
        message: "Mentor Rejected",
        mentor,
    });
});
//Get all Mentors
export const getApprovedMentors = tryCatch(async function (req, res, next) {
    const mentors = await getAllApprovedMentorService();
    return res.status(200).json({
        status: 'sucess',
        mentors,
    });
});
//Get A Single Mentor
export const getMentor = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const mentor = await getSingleMentorById(id);
    if (!mentor)
        throw new AppError('No Mentor found', 404);
    return res.status(200).json({
        status: "sucess",
        mentor,
    });
});
