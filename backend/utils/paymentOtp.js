const crypto = require("crypto");

function generatePaymentOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashPaymentOtp(otp) {
  return crypto
    .createHmac("sha256", process.env.OTP_SECRET)
    .update(otp)
    .digest("hex");
}

function verifyPaymentOtp(otp, storedHash) {
  const newHash = hashPaymentOtp(otp);

  const newBuffer = Buffer.from(newHash, "hex");
  const storedBuffer = Buffer.from(storedHash, "hex");

  return crypto.timingSafeEqual(newBuffer, storedBuffer);
}

module.exports = {
  generatePaymentOtp,
  hashPaymentOtp,
  verifyPaymentOtp,
};
