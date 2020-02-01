const nodemailer = require("nodemailer");

exports.sendEmail = async function(email, subject, text, html) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOSTNAME,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_HOSTNAME,
    to: email,
    subject,
    text,
    html
  });
};
