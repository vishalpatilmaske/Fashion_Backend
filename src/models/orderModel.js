import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orders: [
      {
        products: [
          {
            productId: {
              type: Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
              min: [1, "Quantity must be at least 1"],
            },
          },
        ],
        totalPrice: {
          type: Number,
          required: true,
          min: [0, "Total price must be at least 0"],
        },
        orderStatus: {
          type: String,
          enum: ["pending", "processing", "shipped", "delivered", "canceled"],
          default: "pending",
        },
        payment: {
          method: {
            type: String,
            required: true,
            enum: ["online_payment", "cash_on_delivery"],
          },
          status: {
            type: String,
            enum: ["pending", "successful", "failed"],
            default: "pending",
          },
          transactionId: {
            type: String,
            required: function () {
              return this.payment.method !== "cash_on_delivery";
            },
          },
        },
        isPaid: {
          type: Boolean,
          default: false,
        },
        shippingAddress: {
          type: Schema.Types.ObjectId,
          ref: "User.address",
          required: true,
        },
        deliveredAt: {
          type: Date,
        },
        canceledAt: {
          type: Date,
        },
        orderDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
