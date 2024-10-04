import jwt from "jsonwebtoken";
import { handleError } from "../utils/handleError.js";

// Middleware to check if the user is authenticated
export const isAuthenticated = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and is in the correct format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return handleError(res, 401, "Access token is missing or invalid");
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1].replace(/['"]/g, "").trim();
  // Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return handleError(res, 403, "Invalid token");
    }

    req.user = user;
    next();
  });
};

// Middleware to check if the user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    handleError(res, 403, "Access denied: Admins only");
  }
};
