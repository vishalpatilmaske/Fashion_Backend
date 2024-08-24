import Cart from "../models/cartModel.js";
import { handleError } from "../utils/handleError.js";

// create cart
export const createCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if the user already has a cart
    let existingCart = await Cart.findById(userId);

    if (existingCart) {
      return res.status(409).json({ message: "Cart already exists" });
    }

    // Create a new cart
    const newCart = new Cart({
      userId,
      items: [],
    });

    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error creating new cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get cart all itmes
export const getCartByUserId = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findById(cartId);
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
    const { cartId } = req.params;
    const { productId, quantity } = req.body;
    const cart = await Cart.findById(cartId);
    if (!cart) return handleError(res, 404, "Cart not found");

    // chek the product was already added to the cart if it was added then increase the quantity
    const itemIndex = cart.items.findIndex((item) =>
      item.productId.equals(productId)
    );
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    res.status(200).json("product add successfully ", cart);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    handleError(res, 500, "Internal Server Error");
  }
};

// update cart items
export const updateItemFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    res.json({
      success: true,
      message: "Item updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error updating item from cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//remove item from cart
export const removeItemFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId } = req.body;

    const cart = await Cart.findById(cartId);
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
