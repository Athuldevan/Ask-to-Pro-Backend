import { AppError } from "../utils/AppError.js";
import Mentor from "../model/mentorModel.js";
import mongoose from "mongoose";
//Create Mentor;
export const createMentor = async (userId, data) => {
    const existing = await Mentor.findOne({
        userId: new mongoose.Types.ObjectId(userId)
    });
    if (existing) {
        throw new AppError("Mentor already exists", 400);
    }
    const mentor = await Mentor.create({
        userId: new mongoose.Types.ObjectId(userId),
        userName: data.userName,
        userEmail: data.userEmail,
        userAvatar: data.userAvatar,
        bio: data.bio,
        skills: data.skills,
        category: data.category,
        education: data.education,
        githubUrl: data.githubUrl,
        company: data.company,
        jobTitle: data.jobTitle,
        experience: data.experience,
        price: data.price,
        isVerified: true,
        verificationStatus: "pending",
        avgRating: 0,
        totalSessions: 0,
        totalEarnings: 0
    });
    return mentor;
};
// Get all mentors
export const getAllApprovedMentorService = async function () {
    try {
        const mentors = await Mentor.find({
            verificationStatus: "approved",
            isVerified: true,
        });
        return mentors;
    }
    catch (err) {
        console.log(err.message);
    }
};
//Get a single Mentor By Id
export const getSingleMentorById = async function (id) {
    try {
        const mentor = await Mentor.findById(id);
        return mentor;
    }
    catch (err) {
        console.log(err.message);
    }
};
