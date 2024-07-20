import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    mobile: {
      type: Number,
    },
    pincode: {
      type: Number,
    },
    housenumber: {
      type: Number,
    },
    city: {
      type: String,
    },
    landmark: {
      type: String,
    },
    dist: {
      type: String,
    },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userimage: {
      type: String,
    },
    address: [addressSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
