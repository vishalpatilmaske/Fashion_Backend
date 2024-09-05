import express from "express";

import {
  createRazorpayOrder,
  verifyPayment,
  createOrder,
} from "../controllers/orderController.js";
const router = express.Router();

router.post("/create-razorpay-order", createRazorpayOrder);
router.post("/verify-payment", verifyPayment);
router.post("/:userId/create-order", createOrder);
export default router;
