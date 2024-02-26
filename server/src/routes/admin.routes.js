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
  deleteUser,
  addAddress,
  deleteAddress,
  getAllUsers,
  getUserById,
} from "../controllers/admin.controller.js";
import verifyAdminJWT from "../middleware/adminAuth.middleware.js";

const router = Router();

// Authentication routes
router.post("/register", verifyAdminJWT, register);
router.post("/otp-verify", otpVerification);
router.post("/login", loginUser);
router.post("/logout", verifyAdminJWT, logoutUser);

// User management routes
router.post("/validate-access-token", verifyAdminJWT);
router.post("/password-add-or-update", verifyAdminJWT, passwordUpdate);
router.post("/username-add-or-update", verifyAdminJWT, userNameUpdate);
router.post("/update-by-admin", verifyAdminJWT, updateUserByAdmin);
router.delete("/delete", verifyAdminJWT, deleteUser);
router.put("/add-address", verifyAdminJWT, addAddress); //Come problom
router.delete("/delete-address", verifyAdminJWT, deleteAddress); //Not tested
router.get("/all", verifyAdminJWT, getAllUsers);
router.get("/id", verifyAdminJWT, getUserById);
router.post(
  "/avatar-add-or-update",
  verifyAdminJWT,
  upload.single("avatar"),
  avatarUpdate
);

export default router;
