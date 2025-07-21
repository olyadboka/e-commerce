import express from "express";
const router = express.Router();
import Product from "../models/porduct.js";
import "../controllers/products.js";
import getProductByCategory from "../controllers/products.js";
import fs from "fs";

// Get all products with proper field names
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}).select(
      "proName proDescription proQuantity proPrice proCategory proBrand proImages createdAt isFeatured"
    );

    // Format the data consistently
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      name: product.proName,
      description: product.proDescription,
      quantity: product.proQuantity,
      price: product.proPrice,
      category: product.proCategory,
      brand: product.proBrand,
      images: product.proImages.map((img) => `${img}`),
      createdAt: product.createdAt,
      isFeatured: product.isFeatured,
    }));

    res.status(200).json({
      success: true,
      data: formattedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// for featured product

router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
    }).select(
      "proName proDescription proQuantity proPrice proCategory proBrand proImages createdAt isFeatured"
    );
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      name: product.proName,
      description: product.proDescription,
      quantity: product.proQuantity,
      price: product.proPrice,
      category: product.proCategory,
      brand: product.proBrand,
      images: product.proImages.map((img) => `${img}`),
      createdAt: product.createdAt,
      isFeatured: product.isFeatured,
    }));

    res.status(200).json({
      success: true,
      data: formattedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

//by using the category as a params

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById({ _id: id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Format response
    const formattedProduct = {
      id: product._id,
      name: product.proName,
      description: product.proDescription,
      price: product.proPrice,
      quantity: product.proQuantity,
      category: product.proCategory,
      brand: product.proBrand,
      images: product.proImages.map((img) => `${img}`),
      isFeatured: product.isFeatured,
      createdAt: product.createdAt,
    };

    res.status(200).json({
      success: true,
      data: formattedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

export default router;
