const express = require("express");
const { getSpecifications } = require("../controllers/specificationController");
const { protect } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.route("/").get(protect, getSpecifications);

module.exports = router;
