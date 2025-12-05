import { AppError } from "../utils/AppError";
import Mentor from "../model/mentorModel";

type mentorData = {
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
export const createMentor = async function (userId: string, data: mentorData) {
  const existing = await Mentor.findOne({ userId });
  if (existing) {
    throw new AppError("Mentor already exists", 400);
  }

  // Create Mentoe
  const mentor = await Mentor.create({
    userId,
    ...data,
    profileCompleted: true,
    verificationStatus: "pending",
    isVerified: false,
    avgRating: 0,
    totalSessions: 0,
    totalEarnings: 0,
  });

  return Mentor;
};


// Get all mentors
export const getAllApprovedMentorService = async function(){
  try {
    const mentors = await Mentor.find({verificationStatus:"approved", isVerified:true});

    return mentors;
     
  } catch(err:any){
    console.log(err.message)
  }
}