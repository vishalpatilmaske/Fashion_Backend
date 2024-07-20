import express from "express";
import connectDB from "./src/db/db.js";
import bodyParser from "body-parser";
import userRouter from "./src/routes/userRoute.js";
const app = express();

// connect the data base
connectDB();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// routes
app.use("/user", userRouter);

app.listen(process.env.PORT, () => {
  console.log("server is runnig on the port" + process.env.PORT);
});
