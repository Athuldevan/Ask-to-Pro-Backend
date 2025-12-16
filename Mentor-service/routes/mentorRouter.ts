import express, { Router } from "express";
import { protect } from "../middleware/ProtectMiddleware";
import {
  createMentorProfile,
  getApprovedMentors,
  getMentor,
} from "../controller/mentorController";
import { createSlot, getAllSlots } from "../controller/slotController";

const router = express.Router();
router.use(protect);

router.post("/createProfile", createMentorProfile);
router.get("/getAllMentors", getApprovedMentors);
router.get("/getMentor/:id", getMentor);
router.get("/:mentorId/slots", getAllSlots);
router.post("/slots", createSlot);

export default router;
