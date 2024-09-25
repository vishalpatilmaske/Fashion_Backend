import jwt from "jsonwebtoken";
import { handleError } from "../utils/handleError.js";

// Middleware to check if the user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    handleError(res, 403, "Access denied: Admins only");
  }
};
// is authenticated
export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.access_key;

  if (!token) {
    return handleError(res, 401, "Access token is missing");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return handleError(res, 403, "Invalid token");
    }
    req.user = user;
    next();
  });
};
