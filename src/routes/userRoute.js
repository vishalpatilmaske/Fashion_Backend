import express from "express";
import {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  deleteAllUsers,
  loginUser,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/userController.js";
import encryptPassword from "../middleware/encryptPassword.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Route for user login
router.post("/signup", encryptPassword, createUser);
router.get("/", getAllUsers);
router.get("/:id/data", getSingleUser);
router.delete("/:id", deleteSingleUser);
router.delete("/", deleteAllUsers);

// Routes for signup/signin
router.post("/login", loginUser);

// Routes for user address
router.post("/:id/address", addAddress);
router.patch("/:id/address/:addressId", updateAddress);
router.delete("/:id/address/:addressId", deleteAddress);

export default router;
