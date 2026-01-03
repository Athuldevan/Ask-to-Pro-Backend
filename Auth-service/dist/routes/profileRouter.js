import express from "express";
import { protect } from "../middlewares/protectMiddleware.js";
import { editProfile } from "../controller/profileController.js";
const router = express.Router();
router.patch("/profile/edit", protect, editProfile);
export default router;
//# sourceMappingURL=profileRouter.js.map