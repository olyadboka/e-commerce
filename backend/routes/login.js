import express from "express";
const router = express.Router();
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwtt from "jsonwebtoken";
import "dotenv/config";

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // Find user with password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Remove password and send response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    //generating a token
    const token = jwtt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "7d",
    });

    // console.log(token);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // console.log("Set-Cookie header:", res.getHeaders()["set-cookie"]);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: userWithoutPassword.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

// Get user by email
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user.role,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
});

export default router;
