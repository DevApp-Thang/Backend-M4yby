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
  uploadAvatar,
  loginGoogle,
  loginFacebook,
} = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login/google", loginGoogle);
router.post("/login/facebook", loginFacebook);
router.post("/login", login);
router.post("/token", sendToken);
router.get("/me", protect, getMe);
router.put("/me/updateDetails", protect, updateDetails);
router.put("/me/updatePassword", protect, updatePassword);
router.put("/me/avatar/upload", protect, uploadAvatar);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:otpCode", resetPassword);
router.post("/validateOtp", validateCode);

module.exports = router;
