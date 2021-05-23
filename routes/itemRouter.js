const express = require("express");
const { createItem } = require("../controllers/itemController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/item", protect, createItem);

module.exports = router;
