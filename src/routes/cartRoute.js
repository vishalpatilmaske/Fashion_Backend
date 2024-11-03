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
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router();

router.post("/:userId", isAuthenticated, createCart);
router.get("/:cartId", isAuthenticated, getCartByUserId);
router.post("/:cartId/add", isAuthenticated, addItemToCart);
router.patch("/:cartId/remove", isAuthenticated, removeItemFromCart);
router.delete("/:userId/clear", isAuthenticated, clearCart);
// change
router.post(
  "/:cartId/add-selected-cart-items",
  isAuthenticated,
  addSelectedItems
);
router.post(
  "/:cartId/deselect-selected-cart-items",
  isAuthenticated,
  deselectSelectedCartItems
);

router.patch("/:cartId/update", isAuthenticated, updateItemFromCart);
export default router;
