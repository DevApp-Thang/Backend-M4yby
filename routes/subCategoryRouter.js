const express = require("express");
const { protect } = require("../middlewares/auth");
const { getSubCategories } = require("../controllers/subCategoryController");
const productRouter = require("./productRouter");

const router = express.Router({
  mergeParams: true,
});

router.use("/:sub_id/product", productRouter);

router.route("/").get(protect, getSubCategories);

module.exports = router;
