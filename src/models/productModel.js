import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    size: {
      type: String,
      values: ["M", "S", "L", "XL", "XXL"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: {
        values: ["men", "women"],
        message: "Category must be either 'men' or 'women'",
      },
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
