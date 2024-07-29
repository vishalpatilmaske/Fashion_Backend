import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.cookies.access_key;

  if (!token) {
    return res.status(401).json({ error: "Access denied, token missing!" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Token is not valid" });
      } else {
        req.user = decoded;
        console.log(decoded);
        next();
      }
    });
  }
};
export default auth;
