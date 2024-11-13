import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { handleError } from "../utils/handleError.js";
import sendSignupMail from "../services/sendsignupmail/sendSignupEmail.js";
import sendSigninMail from "../services/sendsigninmail/sendSigninEmail.js";

// Create User
export const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isExist = await User.findOne({ email });

    if (isExist) {
      return handleError(res, 400, "User already exists");
    }

    // Create a new user
    const user = new User({ email, password });
    await user.save();

    // Generate access and refresh tokens
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.refreshToken = refreshToken;
    await user.save();

    if (user) {
      sendSignupMail(email);
    }

    res.cookie("access_key", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.cookie("refresh_key", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    // Set password undefined
    user.password = undefined;
    res.status(201).json({
      success: true,
      message: "Registration successful!",
      data: user,
    });
  } catch (error) {
    handleError(res, 400, error.message);
  }
};
// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return handleError(res, 400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return handleError(res, 404, "Invalid Credential!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return handleError(res, 400, "Invalid password");
    }

    if (user) {
      sendSigninMail(email);
    }
    // Generate access and refresh tokens
    const payload = { id: user.id, email: user.email, role: user.role };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.refreshToken = refreshToken;
    // user.accessToken = accessToken;

    await user.save();

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "User login successfully",
      data: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    handleError(res, 500, "Server error " + error.message);
  }
};
// refresh the access token when it was expire
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_key;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, userData) => {
    if (err) {
      return res.sendStatus(403);
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: userData.id, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("access_key", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.json({ accessToken: newAccessToken });
  });
};

// update users details
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { email, password, userimage, address, role } = req.body;
  ``;
  try {
    // Find the user by ID
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if they are provided
    if (email) user.email = email;

    // If password is provided, hash it and update
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (userimage) user.userimage = userimage;

    // Update the role if provided
    if (role && ["user", "admin"].includes(role)) {
      user.role = role;
    }

    // Update the address if provided
    if (address && address.length > 0) {
      user.address = address;
    }

    // Save the updated user
    const updatedUser = await user.save();

    // Return the updated user data (excluding the password for security reasons)
    const { password: _, ...updatedUserData } = updatedUser.toObject();
    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUserData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
// Controller to get all users in database
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return handleError(res, 404, "No users found in the database.");
    }

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    handleError(res, 500, "An error occurred while fetching users.");
  }
};

// Get single user
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return handleError(res, 404, "User not found.");
    }
    user.password = undefined;
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error.message);
    handleError(res, 500, "An error occurred while fetching the user.");
  }
};

// Delete single user
export const deleteSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Delete the user by ID
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const userId = id;

    // Step 2: Delete associated cart(s) by user ID
    const cartResult = await Cart.deleteMany({ userId });

    // Step 3: Delete associated order(s) by user ID
    const orderResult = await Order.deleteMany({ user: userId });

    res.status(200).json({
      success: true,
      message: "User and associated data deleted successfully!",
      deletedUser: user,
      deletedCarts: cartResult.deletedCount,
      deletedOrders: orderResult.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the user and associated data.",
    });
  }
};

// Delete all users
export const deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({});
    if (result.deletedCount === 0) {
      return handleError(res, 404, "No users found to delete.");
    }
    res
      .status(200)
      .json({ message: `${result.deletedCount} users deleted successfully.` });
  } catch (error) {
    handleError(res, 500, "An error occurred while deleting users.");
  }
};

// Add address
export const addAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullname,
      mobile,
      pincode,
      housenumber,
      area,
      landmark,
      dist,
      primaryaddress,
    } = req.body;

    // Validate that all required fields are provided
    if (
      !fullname ||
      !mobile ||
      !pincode ||
      !housenumber ||
      !area ||
      !landmark ||
      !dist
    ) {
      return handleError(res, 400, "All address fields are required.");
    }

    // Convert relevant fields to numbers
    const mobileNumber = Number(mobile);
    const pincodeNumber = Number(pincode);
    const houseNumber = Number(housenumber);

    // Validate that the conversion was successful
    if (isNaN(mobileNumber) || isNaN(pincodeNumber) || isNaN(houseNumber)) {
      return handleError(
        res,
        400,
        "Invalid data type for mobile, pincode, or housenumber."
      );
    }

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return handleError(res, 404, "User not found.");
    }

    // If the new address is set as the delivery address, update other addresses
    if (primaryaddress) {
      user.address.forEach((addr) => {
        addr.primaryaddress = false;
      });
    }

    // Add the new address to the user's address array
    user.address.push({
      fullname,
      mobile: mobileNumber,
      pincode: pincodeNumber,
      housenumber: houseNumber,
      area,
      landmark,
      dist,
      primaryaddress: Boolean(primaryaddress),
    });

    // Save the updated user document
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: "Address added successfully",
    });
  } catch (error) {
    handleError(res, 500, "An error occurred while adding the address.");
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const {
      mobile,
      pincode,
      housenumber,
      city,
      landmark,
      dist,
      primaryaddress,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return handleError(res, 404, "User not found.");
    }

    const address = user.address.id(addressId);

    if (!address) {
      return handleError(res, 404, "Address not found.");
    }

    if (mobile !== undefined) address.mobile = mobile;
    if (pincode !== undefined) address.pincode = pincode;
    if (housenumber !== undefined) address.housenumber = housenumber;
    if (city !== undefined) address.city = city;
    if (landmark !== undefined) address.landmark = landmark;
    if (dist !== undefined) address.dist = dist;
    if (primaryaddress !== undefined) {
      // If the new address is set as the delivery address, update other addresses
      if (primaryaddress) {
        user.address.forEach((addr) => {
          addr.primaryaddress = false;
        });
      }
      address.primaryaddress = Boolean(primaryaddress);
    }

    await user.save();

    res.status(200).json({ success: true, data: address });
  } catch (error) {
    handleError(res, 500, "An error occurred while updating the address.");
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return handleError(res, 400, "User ID and address ID are required.");
    }

    const user = await User.findById(id);

    if (!user) {
      return handleError(res, 404, "User not found.");
    }

    const address = user.address.id(addressId);

    if (!address) {
      return handleError(res, 404, "Address not found.");
    }

    user.address.pull(addressId);

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Address deleted successfully." });
  } catch (error) {
    handleError(res, 500, "An error occurred while deleting the address.");
  }
};
