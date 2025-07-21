import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product ID is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity cannot be less than 1"],
    default: 1,
  },
  priceAtAddition: {
    type: Number,
    required: [true, "Price must be saved for audit"],
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: [true, "User ID is required"],
      unique: true, // One cart per user
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
      min: [0, "Total price cannot be negative"],
    },
    couponApplied: {
      type: String, // Could also reference a Coupon model
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.priceAtAddition * item.quantity,
    0
  );
  this.lastUpdated = Date.now();
  next();
});

const CartModel = mongoose.model("Cart", cartSchema);

export default CartModel;
