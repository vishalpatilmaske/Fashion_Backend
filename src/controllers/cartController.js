import Cart from "../models/cartModel.js";
import { handleError } from "../utils/handleError.js";

// create cart
export const createCart = async (req, res) => {
  try {
    const { userId, items } = req.body;
    if (!userId || !Array.isArray(items)) {
      return handleError(res, 400, "Invalid input");
    }

    const cart = new Cart({
      userId,
      items,
    });

    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    console.error("Error creating cart:", error);
    handleError(res, 500, "Internal Server Error");
  }
};

// get cart single cart
export const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return handleError(res, 404, "Cart not found");

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    handleError(res, 500, "Internal Server Error");
  }
};

// add item to the cart
export const addItemToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return handleError(res, 404, "Cart not found");

    const itemIndex = cart.items.findIndex((item) =>
      item.productId.equals(productId)
    );
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    handleError(res, 500, "Internal Server Error");
  }
};

//remove item from carrt
export const removeItemFromCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return handleError(res, 404, "Cart not found");

    // to remove the item fileter the cart and only take the products that id not match with the remove product item
    cart.items = cart.items.filter((item) => !item.productId.equals(productId));

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error removing item from cart:", error);
    handleError(res, 500, "Internal Server Error");
  }
};

// clear cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return handleError(res, 404, "Cart not found");

    cart.items = [];

    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    handleError(res, 500, "Internal Server Error");
  }
};
