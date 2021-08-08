const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  getFavorites,
  addToFavorite,
  deleteItem,
} = require("../controllers/favoriteController");

const router = express.Router();

router
  .route("/favorite")
  .get(protect, getFavorites)
  .post(protect, addToFavorite);

router.delete("/favorite/:id", protect, deleteItem);

module.exports = router;
