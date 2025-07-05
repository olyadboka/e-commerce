const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const CartModel = require("../models/cartModel");

// Get all cart items (for admin purposes)
router.get("/", async (req, res) => {
  try {
    const cartItems = await CartModel.find({});
    res.status(200).json({
      success: true,
      message: "All cart items retrieved successfully",
      data: cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cart items",
      error: error.message,
    });
  }
});

// Add item to cart
router.post("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, quantity = 1, price } = req.body;

    // Validate required fields
    if (!userId || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId and price are required",
      });
    }

    // Check if item already exists in user's cart
    const existingCartItem = await CartModel.findOne({
      productId,
      userId,
    });

    if (existingCartItem) {
      // Update quantity if item exists
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return res.status(200).json({
        success: true,
        message: "Cart item quantity updated",
        data: existingCartItem,
      });
    }

    // Create new cart item
    const newCartItem = await CartModel.create({
      productId,
      userId,
      quantity,
      price,
    });

    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: newCartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message,
    });
  }
});

// Update cart item quantity
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const updatedItem = await CartModel.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
      error: error.message,
    });
  }
});

// Remove item from cart
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await CartModel.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: deletedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: error.message,
    });
  }
});

// Get user's cart items
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await CartModel.find({ userId }).populate("productId");

    res.status(200).json({
      success: true,
      message: "User cart items retrieved successfully",
      data: cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user cart items",
      error: error.message,
    });
  }
});

module.exports = router;
