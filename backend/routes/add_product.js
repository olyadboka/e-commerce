import express from "express";
const router = express.Router();
import productModel from "../models/porduct.js";
import { uploadProductImages } from "../config/multer.js";

router.post("/add_product", uploadProductImages, async (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.path);

    const newProduct = new productModel({
      proName: req.body.proName,
      proDescription: req.body.proDescription,
      proQuantity: req.body.proQuantity,
      proPrice: req.body.proPrice,
      proCategory: req.body.proCategory,
      proBrand: req.body.proBrand,
      proImages: imageUrls,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
});

export default router;
