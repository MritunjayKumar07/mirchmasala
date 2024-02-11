import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  otpVerification,
  passwordUpdate,
  registerUser,
  userNameUpdate,
} from "../controlllers/user.controller.js";
import verifyUserJWT from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

router.route("/otp-verify").post(otpVerification);
router.route("/password").post(verifyUserJWT, passwordUpdate);
router.route("/username").post(verifyUserJWT, userNameUpdate);

export default router;
