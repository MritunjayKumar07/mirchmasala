import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  addCatogry,
  addProduct,
  deleteProduct,
  getCategoryById,
  getProduct,
  getProductById,
  imageUpdateProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import verifyAdminJWT from "../middleware/adminAuth.middleware.js";

const router = Router();

//Public routes (viewer)
router.get("/", getProduct);
router.get("/category-id", getCategoryById);
router.get("/product-id", getProductById);

// Authentication routes (admin)
router.post("/add-catogry", verifyAdminJWT, addCatogry);
router.post("/add", verifyAdminJWT, upload.single("image"), addProduct);
router.delete("/delete", verifyAdminJWT, deleteProduct);
router.post("/update", verifyAdminJWT, upload.single("image"), updateProduct);
router.post(
  "/image-update",
  verifyAdminJWT,
  upload.single("image"),
  imageUpdateProduct
);

export default router;
