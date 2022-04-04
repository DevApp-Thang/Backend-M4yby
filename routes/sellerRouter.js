const express = require("express");
const { getSellerDetail } = require("../controllers/sellerController");
const { protect } = require("../middlewares/auth");
const router = express.Router();

router.route("/:sellerId").get(protect, getSellerDetail);

module.exports = router;
