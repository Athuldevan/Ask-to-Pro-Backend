import { AppError } from "../utils/AppError";
import Mentor from "../model/mentorModel";
import mongoose from "mongoose";

type mentorData = {
  // user snapshot (from auth / frontend)
  userName: string;
  userEmail: string;
  userAvatar?: string;

  // mentor profile
  bio: string;
  skills: string[];
  category: string;
  education: string;

  githubUrl?: string;
  company?: string;
  jobTitle?: string;

  experience: number;
  price: number;
};


//Create Mentor;
export const createMentor = async (userId: string, data: mentorData) => {
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
  } catch (err: any) {
    console.log(err.message);
  }
};

//Get a single Mentor By Id
export const getSingleMentorById = async function (id: string) {
  try {
    const mentor = await Mentor.findById(id);
    return mentor;
  } catch (err: any) {
    console.log(err.message);
  }
};
