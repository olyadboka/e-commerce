const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 2. Compare passwords - IMPORTANT: Use bcrypt.compare()
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3. Successful login
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({
      success: true,
      message: "Logged in successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

module.exports = router;
