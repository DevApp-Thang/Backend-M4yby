const express = require("express");
const { protect } = require("../middlewares/auth");
const { create } = require("../controllers/rateController");

const router = express.Router();

router.route("/").post(protect, create);

module.exports = router;
