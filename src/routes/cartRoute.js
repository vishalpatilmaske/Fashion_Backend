import express from "express";
import {
  createCart,
  getCartByUserId,
  addItemToCart,
  removeItemFromCart,
  clearCart,
} from "../controllers/cartController.js"; // Adjust the path as necessary

const router = express.Router();

router.post("/", createCart);
router.get("/:userId", getCartByUserId);
router.patch("/:userId/add", addItemToCart);
router.patch("/:userId/remove", removeItemFromCart);
router.delete("/:userId/clear", clearCart);

export default router;
