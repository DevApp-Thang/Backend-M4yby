const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  getProducts,
  createProduct,
} = require("../controllers/productController");
const specificationRouter = require("./specificationRouter");
const { APIEnum } = require("../constant/api-enum");

const router = express.Router({
  mergeParams: true,
});

router.route("/").get(protect, getProducts).post(protect, createProduct);

router.use(`/:productId/${APIEnum.SPECIFICATION}`, specificationRouter);

module.exports = router;
