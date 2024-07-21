import Product from "../models/productModel.js";
import { handleError } from "../utils/handleError.js";

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    if (!name || !description || !price || !image || !category || !stock) {
      return handleError(res, 400, "All fields are required");
    }

    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      stock,
    });
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

// Get single product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return handleError(res, 404, "Product not found");
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

// Update single product
export const updateProductDetails = async (req, res) => {
  try {
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return handleError(res, 404, "Product not found");
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

// Delete single product
export const deleteSingleProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return handleError(res, 404, "Product not found");
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

// Delete all products
export const deleteAllProducts = async (req, res) => {
  try {
    const result = await Product.deleteMany();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    handleError(res, 500, error.message);
  }
};