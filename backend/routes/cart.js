import express from "express";
const router = express.Router();
import CartModel from "../models/cartModel.js";
import protectedMiddleWare from "../middleware/authentication.js";

// Get all cart items (admin only)
router.get("/cart", protectedMiddleWare, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const cartItems = await CartModel.find({ userId: userId });

    if (!cartItems) {
      res.status(404).json({
        success: false,
        message: "Empty cart",
      });
    }

    res.status(200).json({
      success: true,
      count: cartItems.length,
      data: cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching cart items",
      error: error.message,
    });
  }
});

// Get authenticated user's cart (single route)
router.get("/my-cart", protectedMiddleWare, async (req, res) => {
  try {
    const cartItems = await CartModel.find({ userId: req.user.userId })
      .populate("productId")
      .lean();

    // Calculate total with null check
    const cartTotal = cartItems.reduce((total, item) => {
      return total + (item.productId?.price || 0) * item.quantity;
    }, 0);

    res.status(200).json({
      success: true,
      count: cartItems.length,
      total: cartTotal,
      data: cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cart",
      error: error.message,
    });
  }
});

// Add or update item in cart
router.post("/cart/:productId", protectedMiddleWare, async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(productId);
    const { quantity = 1 } = req.body;
    const userId = req.user._id;

    // Validate quantity
    if (typeof quantity !== "number" || quantity < 1 || quantity > 100) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be between 1 and 100",
      });
    }

    // Check for existing cart item
    let cartItem = await CartModel.findOne({
      productId,
      userId,
    });

    if (cartItem) {
      // Update existing item
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create new item
      cartItem = await CartModel.create({
        productId,
        userId,
        quantity,
      });
    }

    // Populate product details with error handling
    const populatedItem = await CartModel.findById(cartItem._id)
      .populate("productId")
      .orFail(new Error("Product not found"));

    res.status(cartItem ? 200 : 201).json({
      success: true,
      message: cartItem ? "Cart updated" : "Item added to cart",
      data: populatedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add into cart",
      error: error.message,
    });
  }
});

// Update cart item quantity
router.put("/:id", protectedMiddleWare, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.userId;

    // Validate inputs
    if (!quantity || quantity < 1 || quantity > 100) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be between 1 and 100",
      });
    }

    const updatedItem = await CartModel.findOneAndUpdate(
      { _id: id, userId },
      { quantity },
      { new: true, runValidators: true }
    )
      .populate("productId")
      .orFail(new Error("Cart item not found"));

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: updatedItem,
    });
  } catch (error) {
    const status = error.message === "Cart item not found" ? 404 : 500;
    res.status(status).json({
      success: false,
      message: "Failed to update cart item",
      error: error.message,
    });
  }
});

// Remove item from cart
router.delete("/:id", protectedMiddleWare, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deletedItem = await CartModel.findOneAndDelete({
      _id: id,
      userId,
    }).orFail(new Error("Cart item not found"));

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: deletedItem,
    });
  } catch (error) {
    const status = error.message === "Cart item not found" ? 404 : 500;
    res.status(status).json({
      success: false,
      message: "Failed to remove item",
      error: error.message,
    });
  }
});

// Clear user's cart
router.delete("/clear-cart", protectedMiddleWare, async (req, res) => {
  try {
    const result = await CartModel.deleteMany({ userId: req.user.userId });

    res.status(200).json({
      success: true,
      message: `Cleared ${result.deletedCount} items from cart`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
});

export default router;
