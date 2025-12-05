import  express, { Router } from "express";
import { protect } from "../middleware/ProtectMiddleware";

import { createMentorProfile, getApprovedMentors, getMentor } from "../controller/mentorController";
import { createSlot } from "../controller/slotController";
const router = express.Router();
router.post("/createProfile", protect,createMentorProfile)
router.get("/getAllMentors",protect,getApprovedMentors);
router.get("/getMentor/:id", protect, getMentor);
router.post("/slots",protect,createSlot);


export default router;