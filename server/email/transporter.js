const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,     // Your Gmail address
    pass: process.env.GMAIL_PASS,     // App Password (not normal password)
  },
});

module.exports = transporter;
