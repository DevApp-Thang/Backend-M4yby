const express = require("express");
const {
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/item", protect, createItem);
router
  .route("/item/:itemID")
  .put(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;
