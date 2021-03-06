const express = require("express");
const {
  createItem,
  updateItem,
  deleteItem,
  searchItem,
  getItemDetail,
  updateStatusItem,
  getSoldItems,
  getItemsByMe,
} = require("../controllers/itemController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/").post(protect, createItem).get(protect, searchItem);
router
  .route("/:itemID")
  .put(protect, updateItem)
  .delete(protect, deleteItem)
  .get(protect, getItemDetail);

router.route("/:itemID/status").put(protect, updateStatusItem);
router.route("/sold/list").get(protect, getSoldItems);
router.route("/me/list").get(protect, getItemsByMe);

module.exports = router;
