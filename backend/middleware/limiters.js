const rateLimit = require("express-rate-limit");

const { slowDown } = require("express-slow-down");

// Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,

  limit: 5,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  message: {
    message: "Too many login attempts. Try again later.",
  },
});

// OTP Rate Limiting
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,

  limit: 5,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  message: {
    message: "Too many OTP attempts.",
  },
});

// Throttling
const loginSlowDown = slowDown({
  windowMs: 60 * 1000,

  delayAfter: 2,

  delayMs: (hits) => (hits - 2) * 1000,

  maxDelayMs: 5000,
});

module.exports = {
  loginLimiter,
  otpLimiter,
  loginSlowDown,
};
