const express = require("express");
const { createItem } = require("../controllers/itemController");

const router = express.Router();

router.post("/item", createItem);

module.exports = router;
