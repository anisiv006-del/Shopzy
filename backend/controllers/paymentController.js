const Payment = require("../models/Payment");
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

const {
  generatePaymentOtp,
  hashPaymentOtp,
  verifyPaymentOtp,
} = require("../utils/paymentOtp");

const nodemailer = require("nodemailer");

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// STEP 1: Request payment OTP
const requestPaymentOtp = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let totalAmount = 0;
    const paymentItems = [];

    // Calculate amount using database prices
    for (const item of items) {
      if (
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        item.quantity > 100
      ) {
        return res.status(400).json({
          message: "Invalid product or quantity",
        });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title}`,
        });
      }

      totalAmount += product.price * item.quantity;

      paymentItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // Generate OTP
    const otp = generatePaymentOtp();

    // Create payment record
    const payment = new Payment({
      userId: user._id,
      items: paymentItems,
      totalAmount: totalAmount,
      status: "pending",
      otpHash: hashPaymentOtp(otp),
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      otpAttempts: 0,
    });

    await payment.save();

    // Send OTP through email
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: user.emailId,
      subject: "Payment Verification OTP",
      text: `Your payment verification OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.status(200).json({
      message: "Payment OTP sent successfully",
      paymentId: payment._id,
      amount: totalAmount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to initiate payment",
    });
  }
};

// STEP 2: Verify payment OTP
const verifyPaymentOtpController = async (req, res) => {
  try {
    const { paymentId, otp } = req.body;

    if (
      typeof paymentId !== "string" ||
      !/^[0-9a-fA-F]{24}$/.test(paymentId) ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        message: "Invalid payment ID or OTP",
      });
    }

    const payment = await Payment.findOne({
      _id: paymentId,
      userId: req.user.userId,
      status: "pending",
    }).select("+otpHash +otpExpiresAt +otpAttempts");

    if (!payment) {
      return res.status(404).json({
        message: "Pending payment not found",
      });
    }

    if (payment.otpAttempts >= 5) {
      payment.status = "failed";
      payment.otpHash = undefined;
      payment.otpExpiresAt = undefined;
      await payment.save();

      return res.status(429).json({
        message: "Too many incorrect OTP attempts",
      });
    }

    if (!payment.otpExpiresAt || payment.otpExpiresAt < new Date()) {
      payment.status = "failed";
      payment.otpHash = undefined;
      payment.otpExpiresAt = undefined;
      await payment.save();

      return res.status(400).json({
        message: "OTP has expired. Please initiate payment again.",
      });
    }

    payment.otpAttempts += 1;

    if (!verifyPaymentOtp(otp, payment.otpHash)) {
      if (payment.otpAttempts >= 5) {
        payment.status = "failed";
        payment.otpHash = undefined;
        payment.otpExpiresAt = undefined;
      }

      await payment.save();

      return res.status(400).json({
        message: "Incorrect OTP",
      });
    }

    // Reduce stock atomically. Each update only succeeds if enough stock
    // is still available, so two buyers cannot oversell the same item.
    const reservedItems = [];

    const restoreStock = async () => {
      for (const reserved of reservedItems) {
        await Product.updateOne(
          { _id: reserved.productId },
          { $inc: { quantity: reserved.quantity } },
        );
      }
    };

    for (const item of payment.items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.productId, quantity: { $gte: item.quantity } },
        { $inc: { quantity: -item.quantity } },
        { new: true },
      );

      if (!updated) {
        await restoreStock();

        payment.status = "failed";
        payment.otpHash = undefined;
        payment.otpExpiresAt = undefined;
        await payment.save();

        return res.status(409).json({
          message: `${item.title} is out of stock. Payment cancelled.`,
        });
      }

      reservedItems.push(item);
    }

    // Mark demo payment as successful

    let order;

    try {
      order = await Order.create({
        userId: payment.userId,
        items: payment.items,
        totalAmount: payment.totalAmount,
        paymentStatus: "paid",
        orderStatus: "Placed",
      });
    } catch (orderError) {
      await restoreStock();
      throw orderError;
    }

    payment.status = "paid";
    payment.otpHash = undefined;
    payment.otpExpiresAt = undefined;
    await payment.save();

    res.status(200).json({
      message: "Payment verified successfully",
      paymentId: payment._id,
      orderId: order._id,
      amount: payment.totalAmount,
      status: payment.status,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Payment verification failed",
    });
  }
};

// STEP 3: Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json({
      paymentId: payment._id,
      amount: payment.totalAmount,
      status: payment.status,
      items: payment.items,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch payment status",
    });
  }
};

module.exports = {
  requestPaymentOtp,
  verifyPaymentOtpController,
  getPaymentStatus,
};