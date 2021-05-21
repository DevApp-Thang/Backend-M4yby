const express = require("express");
const {
  register,
  login,
  sendToken,
  getMe,
  updateDetails,
  updatePassword,
} = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/token", sendToken);
router.get("/me", protect, getMe);
router.put("/me/updateDetails", protect, updateDetails);
router.put("/me/updatePassword", protect, updatePassword);

module.exports = router;
