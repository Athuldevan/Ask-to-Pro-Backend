import express from 'express';
import { approveMentors, getPendingMentors, rejectMentor } from '../controller/mentorController.js';
import { protect } from '../middleware/ProtectMiddleware.js';
import { restrictTo } from '../middleware/restrictTo.js';
const router = express.Router();
router.get('/mentors/pending', protect, restrictTo("admin"), getPendingMentors);
router.patch("/mentors/:id/approve", protect, restrictTo('admin'), approveMentors);
router.patch("/mentors/:id/reject", protect, restrictTo("admin"), rejectMentor);
export default router;
