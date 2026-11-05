const crypto = require("crypto");

// Generate 6-digit OTP
function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

// Hash OTP before storing in MongoDB
function hashOtp(email, otp) {
  return crypto
    .createHmac("sha256", process.env.OTP_SECRET)
    .update(email + ":" + otp)
    .digest("hex");
}

// Compare OTP hashes safely
function compareOtp(hash1, hash2) {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(hash1, "hex"),
    Buffer.from(hash2, "hex"),
  );
}

module.exports = {
  generateOtp,
  hashOtp,
  compareOtp,
};
