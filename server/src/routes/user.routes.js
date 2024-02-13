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
} from "../controlllers/user.controller.js";
import verifyUserJWT from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/otp-verify").post(otpVerification);
router.route("/password-add-or-update").post(verifyUserJWT, passwordUpdate);
router.route("/username-add-or-update").post(verifyUserJWT, userNameUpdate);
router
  .route("/avatar-add-or-update")
  .post(verifyUserJWT, upload.single("avatar"), avatarUpdate);
router.route("/user-detail-update").post(verifyUserJWT, updateUserDetail);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

export default router;
