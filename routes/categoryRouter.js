const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  getCategories,
  createCategory,
} = require("../controllers/categoryController");
const subCategoryRouter = require("./subCategoryRouter");

const router = express.Router();

router.use("/:id/sub-category", subCategoryRouter);

router.route("/").get(protect, getCategories).post(protect, createCategory);

module.exports = router;
