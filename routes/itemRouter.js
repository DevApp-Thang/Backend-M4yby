const express = require("express");
const {
  createItem,
  updateItem,
  deleteItem,
  searchItem,
} = require("../controllers/itemController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/item").post(protect, createItem).get(protect, searchItem);
router
  .route("/item/:itemID")
  .put(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;
