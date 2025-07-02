const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const UserModel = require("./../models/user");

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const existingUser = await UserModel.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }

      const newUser = await UserModel.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        addresses: req.body.addresses || [],
      });

      newUser.password = undefined;

      res.status(201).json({
        success: true,
        data: newUser,
        message: "Registration successful",
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({
        success: false,
        message: error.message.includes("validation failed")
          ? "Validation error: " +
            Object.values(error.errors)
              .map((el) => el.message)
              .join(", ")
          : "Registration failed",
      });
    }
  })
);

module.exports = router;
