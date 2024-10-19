import { razorpayInstance } from "../../index.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import crypto from "crypto";
import { handleError } from "../utils/handleError.js";
import Product from "../models/productModel.js";

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

// create an order
export const createOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { orders } = req.body;

    // Check if the user already has an order document
    let userOrder = await Order.findOne({ user: userId });

    // To store the new orders that will be added or created
    let newOrders = [];

    // Loop through each order in the request
    for (const order of orders) {
      // Loop through each product in the current order's products array
      for (const product of order.products) {
        // Validate that both productId and quantity are provided
        if (!product.productId || !product.quantity) {
          return res.status(400).json({
            success: false,
            message: "Product ID and quantity are required for all products.",
          });
        }

        // Check if quantity is a positive number (greater than 0)
        if (product.quantity <= 0) {
          return res.status(400).json({
            success: false,
            message: "Quantity must be greater than 0.",
          });
        }

        // Fetch the product details from the database
        const productId = product.productId;
        const purchasedProduct = await Product.findById({ _id: productId });

        // If the product does not exist, return an error
        if (!purchasedProduct) {
          return res.status(404).json({
            success: false,
            message: `Product with ID ${productId} not found.`,
          });
        }

        // Create the single order for each product
        const singleOrder = {
          product: {
            productId: product.productId,
            quantity: product.quantity,
          },
          totalPrice: purchasedProduct.price * product.quantity,
          orderStatus: order.orderStatus || "pending",
          payment: {
            method: order.payment?.method,
            status: order.payment?.status || "pending",
            transactionId: order.payment?.transactionId,
          },
          isPaid: order.isPaid || false,
          shippingAddress: order.shippingAddress,
          deliveredAt: order.deliveredAt || null,
          canceledAt: order.canceledAt || null,
        };

        // If userOrder exists, push the new order to the existing orders array
        if (userOrder) {
          console.log(singleOrder.product);
          userOrder.orders.push(singleOrder);
        } else {
          // Otherwise, add the new single order to newOrders for later creation
          newOrders.push(singleOrder);
        }
      }
    }

    // If userOrder already exists, save the updated document
    if (userOrder) {
      await userOrder.save();
    } else {
      // If no existing order, create a new order document for the user with new orders
      userOrder = new Order({
        user: userId,
        orders: newOrders,
      });
      await userOrder.save();
    }

    res.status(201).json({
      success: true,
      message: "Order(s) placed successfully",
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

// Get all orders of a particular user
export const getUsersOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find all orders associated with the user
    const orders = await Order.find({ user: userId }).populate({
      path: "orders.product.productId",
      select: "name price description image",
    });

    // If no orders found, return a 404
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }

    // Return the populated orders
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    // Catch and return any server errors
    res.status(500).json({
      success: false,
      message: "Error retrieving orders",
      error: error.message,
    });
  }
};

// get all orders of the application
export const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find()
      .populate("user", "name email address")
      .populate({
        path: "orders.product.productId",
        select: "name price description image category",
      });

    // If no orders found, return a 404
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    // Respond with the orders
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error retrieving orders",
      error: error.message,
    });
  }
};

// delete the user order
export const deleteOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    // Find the user's order document by userId
    const userOrders = await Order.findOne({ user: userId });
    if (!userOrders) {
      return handleError(res, 404, "Orders for the user not found");
    }

    // Find the order to be deleted in the orders array
    const orderIndex = userOrders.orders.findIndex(
      (order) => order._id.toString() === orderId
    );

    if (orderIndex === -1) {
      return handleError(res, 404, "Order not found");
    }

    // Remove the order from the array
    userOrders.orders.splice(orderIndex, 1);

    // Save the updated order document
    await userOrders.save();

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "Server error");
  }
};
