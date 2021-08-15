const express = require("express");
const { protect } = require("../middlewares/auth");
const { getProducts } = require("../controllers/productController");

const router = express.Router({
  mergeParams: true,
});

router.route("/").get(protect, getProducts);

module.exports = router;
