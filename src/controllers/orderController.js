import { razorpayInstance } from "../../index.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import crypto from "crypto";
// Create new order
// export const createOrder = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { products, totalPrice, orderStatus, payment, shippingAddress } =
//       req.body;

//     // Check if the user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return handleError(res, 404, "User not found");
//     }

//     // Validate if all required fields are provided
//     if (
//       !products ||
//       !totalPrice ||
//       !orderStatus ||
//       !payment ||
//       !shippingAddress
//     ) {
//       return handleError(res, 400, "All fields are required");
//     }

//     // Validate product details
//     if (!Array.isArray(products) || products.length === 0) {
//       return handleError(
//         res,
//         400,
//         "Products array is required and cannot be empty"
//       );
//     }

//     // Create a new order object
//     const newOrder = {
//       products: products.map((product) => ({
//         product: product.productId,
//         quantity: product.quantity,
//       })),
//       totalPrice,
//       orderStatus,
//       payment: {
//         method: payment.method,
//         status: payment.status || "pending",
//         transactionId: payment.transactionId || null,
//       },
//       isPaid: payment.status === "successful",
//       shippingAddress,
//     };

//     // Check if an order document exists for the user
//     let userOrder = await Order.findOne({ user: userId });

//     if (userOrder) {
//       // If the order document exists, push the new order into the orders array
//       userOrder.orders.push(newOrder);
//     } else {
//       // If no order document exists, create a new one and add the order to the orders array
//       userOrder = new Order({
//         user: userId,
//         orders: [newOrder],
//       });
//     }

//     // Save the order to the database
//     const savedOrder = await userOrder.save();

//     // Send a success response with the saved order
//     return res.status(201).json({
//       message: "Order created successfully",
//       order: savedOrder,
//     });
//   } catch (error) {
//     console.log("Internal Server Error:", error.message);
//     return handleError(res, 500, "Internal server error");
//   }
// };

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
