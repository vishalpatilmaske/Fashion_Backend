import express from "express";
import {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  deleteAllUsers,
  loginUser,
  //   logoutUser,
  //   requestPasswordReset,
  //   resetPassword,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/userController.js";

import encryptPassword from "../middleware/encryptPassword.js";

const router = express.Router();

//  route for user login
router.post("/", encryptPassword, createUser);
router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.delete("/:id", deleteSingleUser);
router.delete("/", deleteAllUsers);

// routes for signup / signin
router.post("/login", loginUser);
// router.post("/logout", logoutUser);
// router.post("/forgot-password", requestPasswordReset);
// router.post("/reset-password", resetPassword);

// routes for user address
router.post("/:id/address", addAddress);
router.patch("/:id/address/:addressId", updateAddress);
router.delete("/:id/address/:addressId", deleteAddress);

export default router;
