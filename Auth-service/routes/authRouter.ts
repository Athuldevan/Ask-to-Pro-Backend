import express from "express";
import {
  forgotPassword,
  login,
  logout,
  register,
  verifyUser,
} from "../controller/authController.js";
import { catchAsync } from "../utils/catchAsync.js";
import { validate } from "../middlewares/joiValidation.js";
import {
  registerSchema,
  verifyUserSchema,
} from "../validations/authValidations.js";
import { protect } from "../middlewares/protectMiddleware.js";

const router = express.Router();
router.post(
  "/register",
  validate({ type: "body", schema: registerSchema }),
  register
);
router.post(
  "/verify",
  validate({ type: "body", schema: verifyUserSchema }),
  catchAsync(verifyUser)
);

router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", protect, forgotPassword)

export default router;
