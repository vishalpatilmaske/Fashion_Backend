import bcrypt from "bcrypt";

const encryptPassword = async (req, res, next) => {
  try {
    if (!req.body.password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    next();
  } catch (error) {
    console.error("Error encrypting password:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export default encryptPassword;
