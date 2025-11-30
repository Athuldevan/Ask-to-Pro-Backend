import mongoose from "mongoose";

interface IMentor extends Document {
  _id: string;
  userId: string;

  bio: string;
  skills: string[];
  category: string;
  education: string;

  githubUrl: string;
  company: string;
  jobTitle: string;

  experience: number;
  price: number;

  isVerified: boolean;
  verificationStatus: "pending" | "approved" | "rejected";

  avgRating: number;
  totalSessions: number;
  totalEarnings: number;
  createdAt: Date;
  updatedAt: Date;
}
const mentorSchema = new mongoose.Schema<IMentor>({
  userId: {
    type: String,
    required: [true, "User id is missing "],
    unique: true,
  },

  bio: {
    type: String,
    required: [true, "Please Provide your Bio"],
    trim: true,
  },

  skills: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },

  education: {
    type: String,
    default: "",
    trim: true,
  },

  githubUrl: {
    type: String,
    default: "",
    trim: true,
  },

  company: {
    type: String,
    default: "",
    trim: true,
  },

  jobTitle: {
    type: String,
    default: "",
    trim: true,
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
  },

  price: {
    type: Number,
    required: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  avgRating: {
    type: Number,
    default: 0,
  },

  totalSessions: {
    type: Number,
    default: 0,
  },
});


const Mentor = mongoose.model<IMentor>('Mentor', mentorSchema);

export default Mentor;