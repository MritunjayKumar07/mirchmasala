import { Router } from "express";
import { register } from "../controllers/admin.controller.js";
import verifyAdminJWT from "../middleware/adminAuth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(verifyAdminJWT,register);

export default router;
