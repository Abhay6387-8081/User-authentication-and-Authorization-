import { Router } from "express";
import {
  changePassword,
  currentUser,
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resendEmailVerificationLink,
  resetPassword,
  updateProfile,
  verifyEmail,
} from "../../controllers/User/user.controller.js";
import { validates } from "../../middlewares/validate.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from "../../validators/user.validator.js";

const router = Router();

router.post("/register", validates(registerSchema), registerUser);

router.post("/resend-email-link",resendEmailVerificationLink);

router.post("/login", validates(loginSchema), loginUser);
router.post("/logout", authenticate, logoutUser);

router.patch(
  "/update-profile",
  validates(updateProfileSchema),
  authenticate,
  updateProfile
);
router.patch(
  "/update-password",
  validates(updatePasswordSchema),
  authenticate,
  changePassword
);

router.post("/forget-password",forgotPassword);
router.get("/verify-email/:emailToken",verifyEmail);

router.get("/reset-password/:resetPasswordToken",resetPassword);

router.post("/reset-password/:resetPasswordToken",validates(resetPasswordSchema),resetPassword)

//~this is for frontend protected routes
router.get("/current", authenticate, currentUser);

export default router;
