"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMentorProfile = exports.getMentor = exports.getApprovedMentors = exports.rejectMentor = exports.approveMentors = exports.getPendingMentors = exports.createMentorProfile = void 0;
const tryCatch_1 = require("../utils/tryCatch");
const AppError_1 = require("../utils/AppError");
const mentorModel_1 = __importDefault(require("../model/mentorModel"));
const mentorService_1 = require("../services/mentorService");
// Get Profile
exports.createMentorProfile = (0, tryCatch_1.tryCatch)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new AppError_1.AppError("Unauthorized", 401);
    const mentor = await (0, mentorService_1.createMentor)(userId, req.body);
    return res.status(201).json({
        status: "success",
        message: "Mentor profile created successfully",
        mentor,
    });
});
//Get Pending Mentotrs
exports.getPendingMentors = (0, tryCatch_1.tryCatch)(async function (req, res, next) {
    const mentors = await mentorModel_1.default.findOne({ verificationStatus: "pending" });
    return res.status(200).json({
        status: "sucess",
        mentors,
    });
});
//Approve Mentor;
exports.approveMentors = (0, tryCatch_1.tryCatch)(async function (req, res, next) {
    const { id, status } = req.params;
    const mentor = await mentorModel_1.default.findByIdAndUpdate({ _id: id }, {
        verificationStatus: "approved",
        isVerified: true,
    }, { new: true });
    if (!mentor) {
        throw new AppError_1.AppError("No Mentor found", 404);
    }
    return res.status(200).json({
        status: "sucess",
        message: "Approved mentor ",
        mentor,
    });
});
//Reject Mentor;
exports.rejectMentor = (0, tryCatch_1.tryCatch)(async function (req, res, next) {
    const { id } = req.params;
    const mentor = await mentorModel_1.default.findByIdAndUpdate(id, {
        verificationStatus: "rejected",
        isVerified: false,
    }, { new: true });
    if (!mentor) {
        throw new AppError_1.AppError("No Mentort Found", 404);
    }
    return res.status(200).json({
        status: "sucess",
        message: "Mentor Rejected",
        mentor,
    });
});
//Get all Mentors
exports.getApprovedMentors = (0, tryCatch_1.tryCatch)(async function (req, res, next) {
    const mentors = await (0, mentorService_1.getAllApprovedMentorService)();
    return res.status(200).json({
        status: "sucess",
        mentors,
    });
});
//Get A Single Mentor
exports.getMentor = (0, tryCatch_1.tryCatch)(async (req, res, next) => {
    const { id } = req.params;
    const mentor = await (0, mentorService_1.getSingleMentorById)(id);
    if (!mentor)
        throw new AppError_1.AppError("No Mentor found", 404);
    return res.status(200).json({
        status: "sucess",
        mentor,
    });
});
//GEt Mentor Profile
exports.getMentorProfile = (0, tryCatch_1.tryCatch)(async function (req, res, next) {
    const { id: userId, role } = req.user;
    if (role != "mentor")
        throw new AppError_1.AppError("Not a Mentor", 403);
    const mentor = await mentorModel_1.default.findOne({ userId });
    if (!mentor)
        throw new AppError_1.AppError("Mentor Profile Not Found", 404);
    return res.status(200).json({
        status: "sucess",
        mentor,
    });
});
