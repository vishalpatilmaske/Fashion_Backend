import express from "express";
import {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProductDetails,
  deleteSingleProduct,
  deleteAllProducts,
  createProducts,
} from "../controllers/productController.js";
import { isAuthenticated, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-product", createProduct);
router.post("/create-products", isAuthenticated, isAdmin, createProducts);
router.get("/:id", getSingleProduct);
router.get("/", getAllProducts);
router.patch("/:id/update", isAuthenticated, isAdmin, updateProductDetails);
router.delete("/:id/delete", isAuthenticated, isAdmin, deleteSingleProduct);
router.delete("/", isAuthenticated, isAdmin, deleteAllProducts);

export default router;
