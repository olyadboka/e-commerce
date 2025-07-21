import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  proName: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  proDescription: {
    type: String,
    trim: true,
  },
  proQuantity: {
    type: Number,
    required: [true, " Quantity of the product is required"],
  },

  proPrice: {
    type: Number,
    required: [true, " The Price of the product is required"],
    min: [0, "Price cannot be negative"],
  },

  proCategory: {
    type: String,

    required: [true, "product category is required"],
  },

  proBrand: {
    type: String,

    required: [true, "product brand is required"],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  proImages: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productModel = mongoose.model("product", productSchema);

export default productModel;
