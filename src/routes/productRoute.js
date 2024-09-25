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
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-product", isAuthenticated, createProduct);
router.post("/create-products", isAuthenticated, createProducts);
router.get("/:id", getSingleProduct);
router.get("/", getAllProducts);
router.patch("/:id/update", isAuthenticated, updateProductDetails);
router.delete("/:id/delete", isAuthenticated, deleteSingleProduct);
router.delete("/", isAuthenticated, deleteAllProducts);

export default router;
