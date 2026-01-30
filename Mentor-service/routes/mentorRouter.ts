import express from "express";
import { protect } from "../middleware/ProtectMiddleware";
import {
  createMentorProfile,
  editMentorProfile,
  getApprovedMentors,
  getMentor,
  getMentorProfile,
} from "../controller/mentorController";
import { createSlot, getAllSlots } from "../controller/slotController";
import { tryCatch } from "../utils/tryCatch";

const router = express.Router();

router
  .route("/profile")
  .get(protect, getMentorProfile)
  .put(protect, tryCatch(editMentorProfile));

router.use(protect);

router.post("/createProfile", createMentorProfile);
router.get("/getAllMentors", getApprovedMentors);
router.post("/slots", createSlot);

router.get("/getMentor/:id", getMentor);
router.get("/:mentorId/slots", getAllSlots);

export default router;
