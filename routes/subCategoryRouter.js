const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  getSubCategories,
  createSubCategory,
} = require("../controllers/subCategoryController");
const productRouter = require("./productRouter");

const router = express.Router({
  mergeParams: true,
});

router.use("/:sub_id/product", productRouter);

router
  .route("/")
  .get(protect, getSubCategories)
  .post(protect, createSubCategory);

module.exports = router;
