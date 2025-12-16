import mongoose, { Schema, Document } from "mongoose";

export interface IMentor extends Document {
  // 🔑 user snapshot
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  userAvatar?: string;

  // mentor profile
  bio: string;
  skills: string[];
  category: string;
  education?: string;

  githubUrl?: string;
  company?: string;
  jobTitle?: string;

  experience: number;
  price: number;

  // status flags
  isVerified: boolean;
  verificationStatus: "pending" | "approved" | "rejected";

  // stats
  avgRating: number;
  totalSessions: number;
  totalEarnings: number;

  // timestamps
  createdAt: Date;
  updatedAt: Date;
}

const mentorSchema = new Schema<IMentor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: true,
      trim: true,
    },

    userAvatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    education: {
      type: String,
      default: "",
    },

    githubUrl: {
      type: String,
      default: "",
    },

    company: {
      type: String,
      default: "",
    },

    jobTitle: {
      type: String,
      default: "",
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    isVerified: {
      type: Boolean,
      default: true,
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

    totalEarnings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Mentor = mongoose.model<IMentor>("Mentor", mentorSchema);
export default Mentor;
