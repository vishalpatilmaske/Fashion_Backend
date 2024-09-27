import express, { json } from "express";
import connectDB from "./src/db/db.js";
import bodyParser from "body-parser";
import userRouter from "./src/routes/userRoute.js";
import productRouter from "./src/routes/productRoute.js";
import cartRouter from "./src/routes/cartRoute.js";
import orderRouter from "./src/routes/orderRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";

const app = express();

// reate razorpay intence to use the razorpay
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// cross origin resource
const allowedOrigins = [
  "https://fashionflickshop.netlify.app", // Production origin
  "http://localhost:5173", // Development origin
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies, etc.)
  })
);

app.use(cookieParser());

// Connect to the database
connectDB();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on the port " + (process.env.PORT || 3000));
});

export default app;
