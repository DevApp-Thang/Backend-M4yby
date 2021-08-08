const express = require("express");
const { protect } = require("../middlewares/auth");
const { getSubCategories } = require("../controllers/subCategoryController");

const router = express.Router();

router.route("/sub-category").get(protect, getSubCategories);

module.exports = router;
