import express from "express";
import {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProductDetails,
  deleteSingleProduct,
  deleteAllProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getSingleProduct);
router.get("/", getAllProducts);
router.patch("/:id/update", updateProductDetails);
router.delete("/:id/delete", deleteSingleProduct);
router.delete("/", deleteAllProducts);

export default router;
