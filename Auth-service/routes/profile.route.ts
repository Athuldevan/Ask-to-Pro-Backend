import express from "express";
import { protect } from "../middlewares/protectMiddleware.js";
import { catchAsync } from "../utils/catchAsync.js";
import { editStudentProfile } from "../controller/profile.controller.js";

const router = express.Router();
//TODO: Modify to PUT
router.route("/profile").patch(protect, catchAsync(editStudentProfile));
export default router;
