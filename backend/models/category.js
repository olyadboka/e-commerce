const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    imageUrl: {
      type: String,
      default: "https://via.placeholder.com/150", // Default placeholder image
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for faster querying
categorySchema.index({ name: 1, isActive: 1 });

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
