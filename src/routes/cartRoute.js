import express from "express";
import {
  createCart,
  getCartByUserId,
  addItemToCart,
  removeItemFromCart,
  clearCart,
  addSelectedItems,
  updateItemFromCart,
  getSelectedCartItems,
  deselectSelectedCartItems,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/:userId", createCart);
router.get("/:cartId", getCartByUserId);
router.post("/:cartId/add", addItemToCart);
router.patch("/:cartId/remove", removeItemFromCart);
router.delete("/:userId/clear", clearCart);
router.post("/:cartId/add-selected-cart-items", addSelectedItems);
router.get("/:cartId/get-selected-cart-items", getSelectedCartItems);
router.post("/:cartId/deselect-selected-cart-items", deselectSelectedCartItems);

router.patch("/:cartId/update", updateItemFromCart);
export default router;
