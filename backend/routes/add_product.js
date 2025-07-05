const express = require("express");
const router = express.Router();
const Product = require("../models/porduct");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "../../clientSide/public/uploads/products";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Add new product with multiple images
router.post("/add_product", upload.array("proImages", 5), async (req, res) => {
  try {
    const {
      proName,
      proDescription,
      proCategory,
      proBrand,
      proPrice,
      proQuantity,
    } = req.body;

    // Get uploaded files paths
    const proImages = req.files.map(
      (file) => `../../backend/public/uploads/products/${file.filename}`
    );

    // Validate at least one image
    if (!proImages || proImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // Create new product
    const newProduct = await Product.create({
      proName,
      proDescription,
      proCategory,
      proBrand,
      proPrice,
      proQuantity,
      proImages,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    // Clean up uploaded files if error occurred
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
});

module.exports = router;
