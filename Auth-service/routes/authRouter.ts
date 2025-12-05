import express from "express";
import {
  forgotPassword,
  login,
  logout,
  refresh,
  register,
  resetPassword,
  verifyUser,
} from "../controller/authController.js";
import { validate } from "../middlewares/joiValidation.js";
import {
  registerSchema,
  verifyUserSchema,
} from "../validations/authValidations.js";


const router = express.Router();
router.post(
  "/register",
  validate({ type: "body", schema: registerSchema }),
  register
);
router.post(
  "/verify",
  validate({ type: "body", schema: verifyUserSchema }),
verifyUser
);

router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset/:token", resetPassword);
router.post("/refresh", refresh);

export default router;
