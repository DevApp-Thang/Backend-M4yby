const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  getSearchHistory,
  deleteSearchHistory,
} = require("../controllers/searchHistoryController");

const router = express.Router();

router.route("/").get(protect, getSearchHistory);
router.route("/:id").delete(protect, deleteSearchHistory);

module.exports = router;
