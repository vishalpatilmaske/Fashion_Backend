import express from "express";

import {
  createRazorpayOrder,
  verifyPayment,
  createOrder,
  getAllOrders,
  getUsersOrders,
  deleteOrder,
} from "../controllers/orderController.js";
const router = express.Router();
import { isAdmin, isAuthenticated } from "../middleware/auth.js";

router.post("/create-razorpay-order", isAuthenticated, createRazorpayOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.post("/:userId/create-order", createOrder);
router.post("/:userId/get-orders", isAuthenticated, getUsersOrders);
router.get("/get-all-orders", isAuthenticated, isAdmin, getAllOrders);
router.delete("/:userId/cancel-order/:orderId", deleteOrder);

export default router;
