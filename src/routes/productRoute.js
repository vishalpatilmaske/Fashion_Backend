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

const router = express.Router();

router.post("/create-product", createProduct);
router.post("/create-products", createProducts);
router.get("/:id", getSingleProduct);
router.get("/", getAllProducts);
router.patch("/:id/update", updateProductDetails);
router.delete("/:id/delete", deleteSingleProduct);
router.delete("/", deleteAllProducts);

export default router;
