require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const asyncHandler = require("express-async-handler");
require("dotenv").config();
const signup = require("./routes/register");
const login = require("./routes/login");
// const products = require("./routes/products");
const cookieParser = require("cookie-parser");
// const logout = require("./routes/logout");
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/", signup);
app.use("/", login);
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Database is connected");
});

app.listen(process.env.PORT, () => {
  console.log("The server is listening on port " + process.env.PORT);
});
