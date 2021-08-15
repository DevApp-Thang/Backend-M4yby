const express = require("express");
const { protect } = require("../middlewares/auth");
const { getCategories } = require("../controllers/categoryController");
const subCategoryRouter = require("./subCategoryRouter");

const router = express.Router();

router.use("/:id/sub-category", subCategoryRouter);

router.route("/").get(protect, getCategories);

module.exports = router;
