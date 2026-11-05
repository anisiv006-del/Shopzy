const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validEmail } = require("../middleware/validationMiddleware");

const { generateOtp, hashOtp, compareOtp } = require("../utils/otp");

const sendOtpEmail = require("../utils/mailer");

// 1. USER REGISTRATION

async function register(req, res) {
  try {
    const { username, emailId, age, password } = req.body;

    if (
      typeof username !== "string" ||
      !username.trim() ||
      !validEmail(emailId) ||
      !Number.isInteger(Number(age)) ||
      Number(age) < 1 ||
      Number(age) > 120 ||
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 72
    ) {
      return res.status(400).json({
        message: "Invalid registration details",
      });
    }

    const email = emailId.trim().toLowerCase();

    const existingUser = await User.findOne({
      emailId: email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 12);

    // Assign role from trusted server configuration.
    // Never accept the role directly from registration input.

    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();

    const role = adminEmail && email === adminEmail ? "admin" : "user";

    const user = await User.create({
      username: username.trim(),

      emailId: email,

      age: Number(age),

      password: hashedPassword,

      role: role,
    });

    res.status(201).json({
      message: "Registration successful",

      user: {
        username: user.username,
        emailId: user.emailId,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    console.log(error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
}

// 2. USER LOGIN

async function login(req, res) {
  try {
    const { emailId, password } = req.body;

    if (
      !validEmail(emailId) ||
      typeof password !== "string" ||
      password.length > 72
    ) {
      return res.status(400).json({
        message: "Invalid login details",
      });
    }

    const email = emailId.trim().toLowerCase();

    const user = await User.findOne({
      emailId: email,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare hashed password

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate OTP

    const otp = generateOtp();

    user.otpHash = hashOtp(email, otp);

    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otpAttempts = 0;

    await user.save();

    // Send OTP through email

    try {
      await sendOtpEmail(email, otp);
    } catch (mailError) {
      user.otpHash = undefined;
      user.otpExpiresAt = undefined;

      await user.save();

      console.log("Email error:", mailError.message);

      return res.status(503).json({
        message: "Unable to send OTP",
      });
    }

    res.status(200).json({
      message: "OTP sent to your registered email",

      emailId: email,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
}

// 3. VERIFY OTP

async function verifyOtp(req, res) {
  try {
    const { emailId, otp } = req.body;

    if (
      !validEmail(emailId) ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        message: "Invalid OTP details",
      });
    }

    const email = emailId.trim().toLowerCase();

    const user = await User.findOne({
      emailId: email,
    }).select("+otpHash +otpExpiresAt +otpAttempts");

    if (!user || !user.otpHash) {
      return res.status(400).json({
        message: "No active OTP. Login again.",
      });
    }

    // Check expiry

    if (user.otpExpiresAt.getTime() < Date.now()) {
      user.otpHash = undefined;
      user.otpExpiresAt = undefined;

      await user.save();

      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // Maximum 5 attempts

    if (user.otpAttempts >= 5) {
      user.otpHash = undefined;
      user.otpExpiresAt = undefined;

      await user.save();

      return res.status(429).json({
        message: "Maximum OTP attempts exceeded",
      });
    }

    // Compare OTP

    const enteredHash = hashOtp(email, otp);

    const isValid = compareOtp(user.otpHash, enteredHash);

    if (!isValid) {
      user.otpAttempts += 1;

      await user.save();

      return res.status(401).json({
        message: "Incorrect OTP",
      });
    }

    // Clear OTP after successful verification

    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    user.isEmailVerified = true;

    await user.save();

    // Generate JWT with role

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        algorithm: "HS256",
      },
    );

    res.status(200).json({
      message: "Login successful",

      token: token,

      user: {
        id: user._id,

        username: user.username,

        emailId: user.emailId,

        age: user.age,

        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "OTP verification failed",
    });
  }
}

module.exports = {
  register,
  login,
  verifyOtp,
};
