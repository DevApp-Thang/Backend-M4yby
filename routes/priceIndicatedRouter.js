const express = require("express");
const { getAll } = require("../controllers/priceIndicatedController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/").get(protect, getAll);

module.exports = router;
