const express = require("express");
const { protect } = require("../middlewares/auth");
const { create } = require("../controllers/rateController");

const router = express.Router();

router.route("/").get(protect, create);

module.exports = router;
