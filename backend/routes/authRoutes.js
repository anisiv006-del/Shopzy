const express = require("express");

const router = express.Router();

const { register, login, verifyOtp } = require("../controllers/authController");

const {
  loginLimiter,
  otpLimiter,
  loginSlowDown,
} = require("../middleware/limiters");

// Registration
router.post("/users", register);

// Login with password + OTP
router.post("/login", loginLimiter, loginSlowDown, login);

// OTP verification
router.post("/verify-otp", otpLimiter, verifyOtp);

module.exports = router;
