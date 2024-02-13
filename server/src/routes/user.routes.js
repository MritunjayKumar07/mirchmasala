import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  avatarUpdate,
  loginUser,
  logoutUser,
  otpVerification,
  passwordUpdate,
  registerUser,
  updateUserDetail,
  userNameUpdate,
} from "../controllers/user.controller.js";
import verifyUserJWT from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/otp-verify").post(otpVerification);

// Routes requiring authentication
router.use(verifyUserJWT);

// Protected routes
router.route("/password-add-or-update").post(passwordUpdate);
router.route("/username-add-or-update").post(userNameUpdate);
router
  .route("/avatar-add-or-update")
  .post(upload.single("avatar"), avatarUpdate);
router.route("/user-detail-update").post(updateUserDetail);

// Logout route
router.route("/logout").post(logoutUser);

export default router;
