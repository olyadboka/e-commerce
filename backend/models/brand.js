const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      unique: true,
      maxlength: [50, "Brand name cannot exceed 50 characters"],
    },
    logoUrl: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Invalid URL format",
      ],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes
brandSchema.index({ name: 1, isFeatured: 1 });

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
