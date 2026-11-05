const express = require("express");
const router = express.Router();

const {
  requestPaymentOtp,
  verifyPaymentOtpController,
  getPaymentStatus,
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

const rateLimit = require("express-rate-limit");

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    message: "Too many payment requests. Try again later.",
  },
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    message: "Too many OTP verification attempts.",
  },
});

router.post("/request-otp", authMiddleware, paymentLimiter, requestPaymentOtp);

router.post(
  "/verify-otp",
  authMiddleware,
  verifyLimiter,
  verifyPaymentOtpController,
);

router.get("/:id", authMiddleware, getPaymentStatus);

module.exports = router;
