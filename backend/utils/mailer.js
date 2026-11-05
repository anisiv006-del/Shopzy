const nodemailer = require("nodemailer");

async function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,

    port: Number(process.env.SMTP_PORT),

    secure: process.env.SMTP_SECURE === "true",

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,

    to: email,

    subject: "Shopping Application Login OTP",

    text: `Your OTP is ${otp}. It is valid for 5 minutes. Do not share it with anyone.`,
  });
}

module.exports = sendOtpEmail;
