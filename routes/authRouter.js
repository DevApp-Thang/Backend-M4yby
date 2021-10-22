const express = require("express");
const {
  register,
  login,
  sendToken,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  validateCode,
} = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/token", sendToken);
router.get("/me", protect, getMe);
router.put("/me/updateDetails", protect, updateDetails);
router.put("/me/updatePassword", protect, updatePassword);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:otpCode", resetPassword);
router.post("/validateOtp", validateCode);

module.exports = router;
