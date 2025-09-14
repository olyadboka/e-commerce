import express from "express";
import Chapa from "chapa";
import Order from "../models/order.js";
import CartModel from "../models/cartModel.js";
import ProductModel from "../models/porduct.js";
import protectedMiddleWare from "../middleware/authentication.js";

const router = express.Router();

// Initialize Chapa with test secret key
const chapa = new Chapa({
  secretKey: "CHASECK_TEST-khE3ePpSLfXh6vIghHq8f1yQdDyWHBB4",
});

// Create order and initiate payment
router.post("/create-order", protectedMiddleWare, async (req, res) => {
  try {
    const { shippingAddress, notes = "" } = req.body;
    const userId = req.user.id;

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.firstName || !shippingAddress.lastName || 
        !shippingAddress.email || !shippingAddress.phone || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete shipping address",
      });
    }

    // Get cart items
    const cartItems = await CartModel.find({ userId })
      .populate({
        path: "productId",
        select: "proName proPrice proBrand proImages proQuantity",
        model: "product",
      })
      .lean();

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // Validate stock and prepare order items
    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of cartItems) {
      const product = cartItem.productId;
      
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found for cart item ${cartItem._id}`,
        });
      }

      if (product.proQuantity < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.proName}. Available: ${product.proQuantity}`,
        });
      }

      const itemTotal = product.proPrice * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        quantity: cartItem.quantity,
        price: product.proPrice,
        name: product.proName,
        image: product.proImages?.[0] || "https://via.placeholder.com/150",
      });
    }

    // Create order
    const order = new Order({
      userId,
      items: orderItems,
      shippingAddress,
      totalAmount,
      notes,
    });

    await order.save();

    // Prepare Chapa payment data
    const paymentData = {
      amount: totalAmount,
      currency: "ETB",
      email: shippingAddress.email,
      first_name: shippingAddress.firstName,
      last_name: shippingAddress.lastName,
      phone_number: shippingAddress.phone,
      tx_ref: order.orderNumber,
      callback_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/callback`,
      return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/success`,
      customization: {
        title: "E-Commerce Store",
        description: `Order #${order.orderNumber}`,
      },
    };

    // Initialize payment with Chapa
    const response = await chapa.initialize(paymentData);

    if (response.status === "success") {
      // Update order with Chapa reference
      order.paymentInfo.chapaReference = response.data.checkout_url;
      await order.save();

      res.status(200).json({
        success: true,
        message: "Order created and payment initialized",
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          checkoutUrl: response.data.checkout_url,
          paymentReference: response.data.reference,
        },
      });
    } else {
      throw new Error("Failed to initialize payment");
    }
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// Verify payment callback
router.post("/verify-payment", protectedMiddleWare, async (req, res) => {
  try {
    const { reference, orderId } = req.body;

    if (!reference || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Payment reference and order ID are required",
      });
    }

    // Verify payment with Chapa
    const verification = await chapa.verify(reference);

    if (verification.status === "success") {
      // Find and update order
      const order = await Order.findOne({
        _id: orderId,
        userId: req.user.id,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Update order payment status
      order.paymentInfo.status = "completed";
      order.paymentInfo.transactionId = reference;
      order.orderStatus = "processing";
      await order.save();

      // Update product quantities
      for (const item of order.items) {
        await ProductModel.findByIdAndUpdate(
          item.productId,
          { $inc: { proQuantity: -item.quantity } }
        );
      }

      // Clear user's cart
      await CartModel.deleteMany({ userId: req.user.id });

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          status: order.paymentInfo.status,
        },
      });
    } else {
      // Update order as failed
      const order = await Order.findOneAndUpdate(
        { _id: orderId, userId: req.user.id },
        {
          "paymentInfo.status": "failed",
          "paymentInfo.transactionId": reference,
        },
        { new: true }
      );

      res.status(400).json({
        success: false,
        message: "Payment verification failed",
        data: {
          orderId: order?._id,
          status: "failed",
        },
      });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
});

// Get user orders
router.get("/orders", protectedMiddleWare, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.productId", "proName proImages")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// Get single order details
router.get("/orders/:orderId", protectedMiddleWare, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({
      _id: orderId,
      userId: req.user.id,
    })
      .populate("items.productId", "proName proImages proBrand")
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

export default router;
