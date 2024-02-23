import { Router } from "express";
import verifyUserJWT from "../middleware/auth.middleware.js";
import { getUserOrders, placeOrder } from "../controllers/order.controller.js";

const router = Router();

// Place Order
router.post("/place", verifyUserJWT, placeOrder);
router.get("/get", getUserOrders);

export default router;
