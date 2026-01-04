import express from "express";
import { protect } from "../middleware/ProtectMiddleware";
import {
  createMentorProfile,
  getApprovedMentors,
  getMentor,
  getMentorProfile,
} from "../controller/mentorController";
import { createSlot, getAllSlots } from "../controller/slotController";

const router = express.Router();

router.get("/profile", protect, getMentorProfile);
//This run wit all routess
router.use(protect);

router.post("/createProfile", createMentorProfile);
router.get("/getAllMentors", getApprovedMentors);
router.post("/slots", createSlot);

router.get("/getMentor/:id", getMentor);
router.get("/:mentorId/slots", getAllSlots);

export default router;
