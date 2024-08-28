import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema(
  {
    fullname: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    pincode: {
      type: Number,
    },
    housenumber: {
      type: Number,
    },
    area: {
      type: String,
    },
    landmark: {
      type: String,
    },
    dist: {
      type: String,
    },
    primaryaddress: {
      type: Boolean,
    },
  },
  { _id: true }
);

const userSchema = new Schema(
  {
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
