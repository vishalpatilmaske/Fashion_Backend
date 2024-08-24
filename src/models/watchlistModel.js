import mongoose, { Schema } from "mongoose";

const watchlistSchema = new Schema(
  {
    userId: {
      Type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      Types: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

const Watchlist = mongoose.model("Watchlist", watchlistSchema);
export default Watchlist;
