const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
} = require("../controllers/productController");
const { isAdmin } = require("../middleware/authMiddleware");

router.get("/", getProducts);
router.post("/", isAdmin, createProduct);

module.exports = router;
