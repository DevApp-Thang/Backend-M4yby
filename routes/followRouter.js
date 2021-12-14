const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const { addFollow, unfollow } = require("../controllers/followController");

router.post("/", protect, addFollow);
router.delete("/:id", protect, unfollow);

module.exports = router;
