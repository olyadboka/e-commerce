const getProductByCategory = require("../controllers/products.js");
const express = require("express");
const router = express.Router();

router.get("/:category", getProductByCategory);

module.exports = router;
