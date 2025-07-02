const express = require("express");
const productModel = require("../models/porduct");
const router = express.Router();

//getting all of the product
router.get("/", (req, res) => {
  const products = productModel.find();

  res.status(200).json({
    success: "success",
    message: "This are all of the products",
    data: products,
  });
});
// getting a specific product by using an id
router.get("/:id", (req, res) => {
  const id = req.params.id * 1;
  const product = productModel.findById({ id });
  res.status(200).json({
    success: "success",
    message: "This is the required product",
    data: product,
  });
});

// gettting a group of product
router.get("/:categroy", (req, res) => {
  const categroy = req.params.categroy;
  const products = productModel.find({ categroy });
  res.status(200).json({
    success: "success",
    message: "Those are the products with the specified category",
    data: products,
  });
});

//getting the products that have a price of 500
router.get("/:price", (req, res) => {
  const price = req.params.price;
  const products = productModel.find({ price: { $lte: this.price } });
  res.status(200).json({
    success: "success",
    message: "This is the products that has lessthan or equal to 500",
    data: products,
  });
});
//exporting the router

module.exports = router;
