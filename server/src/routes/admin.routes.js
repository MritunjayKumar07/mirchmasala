import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  register,
  otpVerification,
  passwordUpdate,
  userNameUpdate,
  avatarUpdate,
  loginUser,
  logoutUser,
  updateUserByAdmin,
} from "../controllers/admin.controller.js";
import verifyAdminJWT from "../middleware/adminAuth.middleware.js";

const router = Router();

// Admin routes
router.route("/register").post(verifyAdminJWT, register);
router.route("/otp-verify").post(otpVerification);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyAdminJWT, logoutUser);
router.route("/password-add-or-update").post(verifyAdminJWT, passwordUpdate);
router.route("/username-add-or-update").post(verifyAdminJWT, userNameUpdate);
router.route("/update-by-admin").post(verifyAdminJWT, updateUserByAdmin);
router
  .route("/avatar-add-or-update")
  .post(upload.single("avatar"), verifyAdminJWT, avatarUpdate);

export default router;
