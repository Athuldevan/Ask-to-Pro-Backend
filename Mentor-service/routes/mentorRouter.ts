import  express, { Router } from "express";
import { protect } from "../middleware/ProtectMiddleware";

import { createMentorProfile, getApprovedMentors } from "../controller/mentorController";
const router = express.Router();
router.post("/createProfile", protect,createMentorProfile)
router.get("/getAllMentors",protect,getApprovedMentors);


export default router;