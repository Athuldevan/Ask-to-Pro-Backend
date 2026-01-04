"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleMentorById = exports.getAllApprovedMentorService = exports.createMentor = void 0;
const AppError_1 = require("../utils/AppError");
const mentorModel_1 = __importDefault(require("../model/mentorModel"));
const mongoose_1 = __importDefault(require("mongoose"));
//Create Mentor;
const createMentor = async (userId, data) => {
    const existing = await mentorModel_1.default.findOne({
        userId: new mongoose_1.default.Types.ObjectId(userId)
    });
    if (existing) {
        throw new AppError_1.AppError("Mentor already exists", 400);
    }
    const mentor = await mentorModel_1.default.create({
        userId: new mongoose_1.default.Types.ObjectId(userId),
        userName: data.userName,
        userEmail: data.userEmail,
        userAvatar: data.userAvatar,
        bio: data.bio,
        skills: data.skills,
        career: data.career,
        domains: data.domains,
        education: data.education,
        githubUrl: data.githubUrl,
        company: data.company,
        jobTitle: data.jobTitle,
        experience: data.experience,
        hourlyRate: data.hourleyRate,
        isVerified: true,
        verificationStatus: "pending",
        avgRating: 0,
        totalSessions: 0,
        totalEarnings: 0
    });
    return mentor;
};
exports.createMentor = createMentor;
// Get all mentors
const getAllApprovedMentorService = async function () {
    try {
        const mentors = await mentorModel_1.default.find({
            verificationStatus: "approved",
            isVerified: true,
        });
        return mentors;
    }
    catch (err) {
        console.log(err.message);
    }
};
exports.getAllApprovedMentorService = getAllApprovedMentorService;
//Get a single Mentor By Id
const getSingleMentorById = async function (id) {
    try {
        const mentor = await mentorModel_1.default.findById(id);
        return mentor;
    }
    catch (err) {
        console.log(err.message);
    }
};
exports.getSingleMentorById = getSingleMentorById;
