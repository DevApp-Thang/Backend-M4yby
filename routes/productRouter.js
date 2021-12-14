const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  getProducts,
  createProduct,
} = require("../controllers/productController");

const router = express.Router({
  mergeParams: true,
});

router.route("/").get(protect, getProducts).post(protect, createProduct);

module.exports = router;
