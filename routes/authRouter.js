const express = require("express");
const { register, login, sendToken } = require("../controllers/authController");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.post("/token", sendToken);

module.exports = router;
