import express from "express";
import { protect } from "../middlewares/protectMiddleware";
import { editProfile } from "../controller/profile.controller";
const router = express.Router();
router.patch("/edit", protect, editProfile);
export default router;
//# sourceMappingURL=profileRouter.js.map