const express = require("express");
const {
  createItem,
  updateItem,
  deleteItem,
  searchItem,
  getItemDetail,
  updateStatusItem,
  getSoldItems,
} = require("../controllers/itemController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/item").post(protect, createItem).get(protect, searchItem);
router
  .route("/item/:itemID")
  .put(protect, updateItem)
  .delete(protect, deleteItem)
  .get(protect, getItemDetail);

router.route("/item/:itemID/status").put(protect, updateStatusItem);
router.route("/item-sold").get(protect, getSoldItems);

module.exports = router;
