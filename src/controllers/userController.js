import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// controller to create user
export const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isexist = await User.findOne({ email });

    if (isexist) {
      return res.status(400).json({ message: "User already exist" });
    }

    const user = new User({ email, password });

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// controller to get all users in database

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found in the database." });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};

// get single user

export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    console.log("user deleted successfully");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user." });
  }
};

// delete user

export const deleteSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error deleting user by ID:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while deleteing the user." });
  }
};

// delete all users

export const deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({});
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No users found to delete." });
    }
    res
      .status(200)
      .json({ message: `${result.deletedCount} users deleted successfully.` });
  } catch (error) {
    console.error("Error deleting users:", error.message);
    res.status(500).json({ error: "An error occurred while deleting users." });
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// add address
export const addAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { mobile, pincode, housenumber, city, landmark, dist } = req.body;

    // if any one field was missing then disply message
    if (!mobile || !pincode || !housenumber || !city || !landmark || !dist) {
      return res
        .status(400)
        .json({ message: "All address fields are required." });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.address.push({ mobile, pincode, housenumber, city, landmark, dist });

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error adding address:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while adding the address." });
  }
};

// update address

export const updateAddress = async (req, res) => {
  try {
    const { id, addressId } = req.params;
    const { mobile, pincode, housenumber, city, landmark, dist } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const address = user.address.id(addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found." });
    }

    if (mobile !== undefined) address.mobile = mobile;
    if (pincode !== undefined) address.pincode = pincode;
    if (housenumber !== undefined) address.housenumber = housenumber;
    if (city !== undefined) address.city = city;
    if (landmark !== undefined) address.landmark = landmark;
    if (dist !== undefined) address.dist = dist;

    await user.save();

    res.status(200).json(address);
  } catch (error) {
    console.error("Error updating address:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while updating the address." });
  }
};

// delete address

export const deleteAddress = async (req, res) => {
  try {
    const { id, addressId } = req.params;

    if (!id || !addressId) {
      return res
        .status(400)
        .json({ message: "User ID and address ID are required." });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const address = user.address.id(addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found." });
    }

    user.address.pull(addressId);

    await user.save();

    res.status(200).json({ message: "Address deleted successfully." });
  } catch (error) {
    console.error("Error deleting address:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the address." });
  }
};
