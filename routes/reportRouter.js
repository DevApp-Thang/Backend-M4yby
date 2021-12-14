const express = require("express");
const router = express.Router();
const { createReport } = require("../controllers/reportController");
const { protect } = require("../middlewares/auth");

router.post("/", protect, createReport);

module.exports = router;
