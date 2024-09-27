import { razorpayInstance } from "../../index.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import crypto from "crypto";

// create razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Converting to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res
        .status(500)
        .json({ success: false, message: "Error creating order" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    // Step 1: Generate expected signature
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const expectedSignature = shasum.digest("hex");

    // Step 2: Compare signatures
    if (razorpaySignature !== expectedSignature) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    // Step 3: If successful, respond to frontend
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: req.body,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { orders } = req.body;

    // Find the existing order document for the user
    let userOrder = await Order.findOne({ user: userId });

    if (userOrder && orders) {
      // If the order document exists, append new orders to the existing orders array
      userOrder.orders.push(
        ...orders.map((order) => ({
          products: order.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
          totalPrice: order.totalPrice,
          orderStatus: order.orderStatus,
          payment: order.payment,
          isPaid: order.isPaid,
          shippingAddress: order.shippingAddress,
          deliveredAt: order.deliveredAt || null,
          canceledAt: order.canceledAt || null,
        }))
      );
    } else {
      // If the order document doesn't exist, create a new one
      userOrder = new Order({
        user: userId,
        orders: orders.map((order) => ({
          products: order.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
          totalPrice: order.totalPrice,
          orderStatus: order.orderStatus,
          payment: order.payment,
          isPaid: order.isPaid,
          shippingAddress: order.shippingAddress,
          deliveredAt: order.deliveredAt || null,
          canceledAt: order.canceledAt || null,
        })),
      });
    }

    // Save the updated or new order document to the database
    await userOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: userOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message,
    });
  }
};
// get all orders
export const getAllOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate if the user exists
    const isValidUser = await User.findById(userId);

    if (!isValidUser) {
      return handleError(res, 404, "User not found");
    }

    // Find all orders associated with the user
    const orders = await Order.find({ user: userId }).populate(
      "orders.products.productId",
      "name price description image"
    );

    if (!orders || orders.length === 0) {
      return handleError(res, 404, "No orders found for this user");
    }

    // If orders are found, send them in response
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving orders",
      error: error.message,
    });
  }
};
