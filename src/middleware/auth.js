import jwt from "jsonwebtoken";
import { handleError } from "../utils/handleError.js";

const auth = (req, res, next) => {
  const token = req.cookies.access_key;
  console.log(token);
  if (!token) {
    return handleError(res, 401, "Access denied ,token missing!");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return handleError(res, 401, "Token is not valid");
      } else {
        console.log(decoded);
        req.user = decoded;
        next();
      }
    });
  }
};
export default auth;
