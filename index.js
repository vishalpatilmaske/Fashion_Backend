import express from "express";
import connectDB from "./src/db/db.js";
const app = express();

// connect the data base
connectDB();

app.listen(process.env.PORT, () => {
  console.log("server is runnig on the port" + process.env.PORT);
});
