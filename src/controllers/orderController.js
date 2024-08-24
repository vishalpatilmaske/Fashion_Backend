import Order from "../models/orderModel.js";
import { handleError } from "../utils/handleError.js"; // Import the error handler

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { user, products, totalPrice } = req.body;

    const newOrder = new Order({
      user,
      products,
      totalPrice,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    handleError(res, 500, "Internal Server Error");
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.product");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    handleError(res, 500, "Internal Server Error");
  }
};

// Get an order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("user")
      .populate("products.product");

    if (!order) {
      return handleError(res, 404, "Order not found");
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    handleError(res, 500, "Internal Server Error");
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return handleError(res, 404, "Order not found");
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    handleError(res, 500, "Internal Server Error");
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return handleError(res, 404, "Order not found");
    }

    await order.remove();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    handleError(res, 500, "Internal Server Error");
  }
};
