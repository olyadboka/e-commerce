import "dotenv/config";
import express, { application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import asyncHandler from "express-async-handler";
import signup from "./routes/register.js";
import login from "./routes/login.js";
import add_product from "./routes/add_product.js";
import products from "./routes/products.js";
import cookieParser from "cookie-parser";
import cart from "./routes/cart.js";
import related from "./routes/related.js";

// const logout = require("./routes/logout");

import authentication from "./middleware/authentication.js";
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// app.use()
app.use("/products", products);

// app.use(cookieParser());

app.use("/", signup);
app.use("/", login);

app.use("/related", related);

app.use(authentication);
app.use("/cart", cart);
app.use("/", add_product);

// app.use("/", logout);
// app.use("/", home);
// app.use("/", products);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API working successfully",
    data: null,
    timestamp: new Date(),
  });
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Database is connected");
});

app.listen(process.env.PORT, () => {
  console.log("The server is listening on port " + process.env.PORT);
});
