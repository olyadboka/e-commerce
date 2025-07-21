import getProductByCategory from "../controllers/products.js";
import express from "express";
const router = express.Router();

router.get("/:category", getProductByCategory);

export default router;
