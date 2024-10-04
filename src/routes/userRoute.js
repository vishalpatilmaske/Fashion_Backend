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
  refreshAccessToken,
  updateUser,
} from "../controllers/userController.js";
import encryptPassword from "../middleware/encryptPassword.js";
import { isAuthenticated, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// User authentication routes
router.post("/signup", encryptPassword, createUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// User management routes
router.get("/", isAuthenticated, getAllUsers);
router.get("/:id/data", isAuthenticated, getSingleUser);
router.delete("/:id", deleteSingleUser);
router.delete("/", isAuthenticated, isAdmin, deleteAllUsers);
router.patch("/:id/update-user", isAuthenticated, isAdmin, updateUser);

// User address routes
router.post("/:id/address", isAuthenticated, addAddress);
router.patch(
  "/:userId/update-address/:addressId",
  isAuthenticated,
  updateAddress
);
router.delete("/:id/address/:addressId", isAuthenticated, deleteAddress);

export default router;
