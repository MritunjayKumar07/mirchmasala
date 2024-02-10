import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  otpVerification,
  passwordUpdate,
  registerUser,
} from "../controlllers/user.controller.js";

const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

router.route("/otp-verify").post(otpVerification);

router.route("/password").post(passwordUpdate);

export default router;
