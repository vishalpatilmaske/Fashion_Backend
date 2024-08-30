import { handleError } from "../utils/handleError.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { products, totalPrice, orderStatus, payment, shippingAddress } =
      req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return handleError(res, 404, "User not found");
    }

    // Validate if all required fields are provided
    if (
      !products ||
      !totalPrice ||
      !orderStatus ||
      !payment ||
      !shippingAddress
    ) {
      return handleError(res, 400, "All fields are required");
    }

    // Validate product details
    if (!Array.isArray(products) || products.length === 0) {
      return handleError(
        res,
        400,
        "Products array is required and cannot be empty"
      );
    }

    // Create a new order object
    const newOrder = {
      products: products.map((product) => ({
        product: product.productId,
        quantity: product.quantity,
      })),
      totalPrice,
      orderStatus,
      payment: {
        method: payment.method,
        status: payment.status || "pending",
        transactionId: payment.transactionId || null,
      },
      isPaid: payment.status === "successful",
      shippingAddress,
    };

    // Check if an order document exists for the user
    let userOrder = await Order.findOne({ user: userId });

    if (userOrder) {
      // If the order document exists, push the new order into the orders array
      userOrder.orders.push(newOrder);
    } else {
      // If no order document exists, create a new one and add the order to the orders array
      userOrder = new Order({
        user: userId,
        orders: [newOrder],
      });
    }

    // Save the order to the database
    const savedOrder = await userOrder.save();

    // Send a success response with the saved order
    return res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.log("Internal Server Error:", error.message);
    return handleError(res, 500, "Internal server error");
  }
};
