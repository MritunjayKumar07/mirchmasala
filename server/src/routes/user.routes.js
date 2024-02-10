import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  otpVerification,
  registerUser,
} from "../controlllers/user.controller.js";

const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

router.route("/otpVerify").post(otpVerification);

export default router;
