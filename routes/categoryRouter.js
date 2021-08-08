const express = require("express");
const { protect } = require("../middlewares/auth");
const { getCategories } = require("../controllers/categoryController");

const router = express.Router();

router.route("/category").get(protect, getCategories);

module.exports = router;
