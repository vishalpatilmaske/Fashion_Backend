import express from "express";
import {
  createCart,
  getCartByUserId,
  addItemToCart,
  removeItemFromCart,
  clearCart,
  updateItemFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", createCart);
router.get("/:cartId", getCartByUserId);
router.post("/:cartId/add", addItemToCart);
router.patch("/:userId/remove", removeItemFromCart);
router.delete("/:userId/clear", clearCart);
router.patch("/:cartId/update", updateItemFromCart);

export default router;
