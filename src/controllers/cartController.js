import Cart from "../models/cartModel.js";
import { handleError } from "../utils/handleError.js";

// create cart
export const createCart = async (req, res) => {
  try {
    const { userId } = req.params;
    // Check if the user already has a cart
    const existingCart = await Cart.findOne({ userId: userId });

    if (existingCart) {
      return res
        .status(409)
        .json({ message: "Cart already exists", data: existingCart });
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

// add items to the selected cart items
export const addSelectedItems = async (req, res) => {
  try {
    const { cartId } = req.params;
    const product = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check if the incoming data is an array of products
    if (Array.isArray(product.productId)) {
      product.productId.forEach((item) => {
        // Check if the productId already exists in selectedItems
        const exists = cart.selectedItems.some(
          (selectedItem) =>
            selectedItem.productId.toString() === item.productId.toString()
        );
        if (!exists) {
          cart.selectedItems.push({
            productId: item.productId,
            quantity: item.quantity,
          });
        }
      });
    } else if (product && product.productId) {
      // For a single product, check if it already exists in selectedItems
      const exists = cart.selectedItems.some(
        (selectedItem) =>
          selectedItem.productId.toString() === product.productId.toString()
      );
      if (!exists) {
        cart.selectedItems.push({
          productId: product.productId,
          quantity: product.quantity,
        });
      }
    } else {
      return res.status(400).json({ message: "Invalid product data" });
    }

    await cart.save();

    res.status(200).json({
      message: "Selected items added successfully",
      data: cart.selectedItems,
    });
  } catch (error) {
    console.error(
      "Error adding items to the selected cart items: ",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get item from selected items
export const getSelectedCartItems = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await Cart.findById(cartId);
    if (!cart) handleError(res, 404, "cart not found");

    const selectedItems = cart?.selectedItems;

    res.status(200).json({
      message: "selected items get successfully",
      data: selectedItems,
    });
  } catch (error) {
    console.log("Error while geting prodcuts from select items", error.message);
    handleError(res, 500, "Internal Server Error");
  }
};

// Deselct cart items by id
export const deselectSelectedCartItems = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId } = req.body;

    // Check the cart
    const cart = await Cart.findById(cartId);
    if (!cart) return handleError(res, 404, "Cart Not Found");

    // Deselect the item in the selectedItems array
    if (productId) {
      cart.selectedItems = cart.selectedItems.filter(
        (product) => product.productId != productId
      );
    } else {
      cart.selectedItems = [];
    }
    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Product deselected from cart", cart });
  } catch (error) {
    console.log("Error while deselecting cart items:", error.message);
    handleError(res, 500, "Internal Server Error");
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
