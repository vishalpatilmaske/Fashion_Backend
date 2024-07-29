import express from "express";
import connectDB from "./src/db/db.js";
import bodyParser from "body-parser";
import userRouter from "./src/routes/userRoute.js";
import productRouter from "./src/routes/productRoute.js";
import cartRouter from "./src/routes/cartRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// middlwares
app.use(cors());
app.use(cookieParser());

// Connect to the database
connectDB();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Routes
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on the port " + (process.env.PORT || 3000));
});
