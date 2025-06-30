const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, " Quantity of the product is required"],
  },

  price: {
    type: Number,
    required: [true, " The Price of the product is required"],
    min: [0, "Price cannot be negative"],
  },
  offerPrice: {
    type: Number,
    min: [0, "Offer price cannot be negative"],
    validate: {
      validator: function (value) {
        return value <= this.price;
      },
      message: "Offer price must be less than or equal to regular price",
    },
  },
  proCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  proSubCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subCategory",
    required: true,
  },
  proBrandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BrandModel",
  },
});

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
