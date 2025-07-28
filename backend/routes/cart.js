import express from "express";
const router = express.Router();
import CartModel from "../models/cartModel.js";
import protectedMiddleWare from "../middleware/authentication.js";
import ProductModel from "../models/porduct.js";

// Get all cart items (admin only)
router.get("/cart", protectedMiddleWare, async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await CartModel.find({ userId: userId }).populate({
      path: "productId",
      select: "name price brand images",
      model: "Product",
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
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

// Get authenticated user's cart
router.get("/my-cart", protectedMiddleWare, async (req, res) => {
  try {
    const cartItems = await CartModel.find({ userId: req.user.id })
      .populate({
        path: "productId",
        select: "proName proPrice proBrand proImages proQuantity",
        model: "product",
      })
      .lean();

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        total: 0,
        data: [],
        message: "Your cart is empty",
      });
    }

    // Format response to match frontend expectations
    const formattedItems = cartItems.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
      price: item.price,
      productId: {
        _id: item.productId?._id,
        name: item.productId?.proName || "Unknown Product",
        price: item.productId?.proPrice || 0,
        brand: item.productId?.proBrand || "No Brand",
        image:
          item.productId?.proImages?.[0] || "https://via.placeholder.com/150",
        quantity: item.productId?.proQuantity || 0,
      },
    }));
    console.log(formattedItems.name);
    console.log(formattedItems);
    const cartTotal = formattedItems.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    res.status(200).json({
      success: true,
      count: formattedItems.length,
      total: cartTotal.toFixed(2),
      data: formattedItems,
    });
  } catch (error) {
    console.error("Cart error:", error);
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
    const { quantity = 1 } = req.body;
    const userId = req.user.id;

    // Validate quantity
    if (typeof quantity !== "number" || quantity < 1 || quantity > 100) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be between 1 and 100",
      });
    }

    // Verify product exists and get current price
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock availability
    if (product.proQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.proQuantity} available in stock`,
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
      // Update price if it has changed
      if (cartItem.price !== product.proPrice) {
        cartItem.price = product.proPrice;
      }
      await cartItem.save();
    } else {
      // Create new item with current product price
      cartItem = await CartModel.create({
        productId,
        userId,
        quantity,
        price: product.proPrice, // Using product's price field
      });
    }

    // Get populated cart item for response
    const populatedItem = await CartModel.findById(cartItem._id)
      .populate({
        path: "productId",
        select: "proName proPrice proBrand proImages",
      })
      .lean();

    const formattedItem = {
      _id: populatedItem._id,
      quantity: populatedItem.quantity,
      price: populatedItem.price,
      productId: {
        _id: populatedItem.productId._id,
        name: populatedItem.productId.proName,
        price: populatedItem.productId.proPrice,
        brand: populatedItem.productId.proBrand,
        image:
          populatedItem.productId.proImages?.[0] ||
          "https://via.placeholder.com/150",
      },
    };

    res.status(200).json({
      success: true,
      message: cartItem ? "Cart updated" : "Item added to cart",
      data: formattedItem,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to cart",
      error: error.message,
    });
  }
});

// Update cart item quantity
router.put("/:id", protectedMiddleWare, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!quantity || quantity < 1 || quantity > 100) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be between 1 and 100",
      });
    }

    const cartItem = await CartModel.findOne({ _id: id, userId })
      .populate("productId")
      .orFail(new Error("Cart item not found"));

    // Check stock availability
    if (cartItem.productId.proQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${cartItem.productId.proQuantity} available in stock`,
      });
    }

    // Update price if it has changed
    if (cartItem.price !== cartItem.productId.proPrice) {
      cartItem.price = cartItem.productId.proPrice;
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: cartItem,
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
    const userId = req.user.id;

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
    const result = await CartModel.deleteMany({ userId: req.user.id });

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
