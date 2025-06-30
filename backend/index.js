const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const asyncHandler = require("express-async-handler");
const signup = require("./routes/register");
const login = require("./routes/login");
const products = require("./routes/products");

const app = express();

app.use(express.json());
app.use(cors());

app.use(signup);
app.use(login);
app.use("/", home);
app.use(products);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API working successfully",
    data: null,
    timestamp: new Date(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

mongoose.connect("mongodb://localhost:27017/ecommerce").then(() => {
  console.log("Database is connected");
});

app.listen(3333, () => {
  console.log("The server is listening on port 3333");
});
