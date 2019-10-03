const nodemailer = require("nodemailer");

exports.sendEmail = async function(email, subject, text, html) ***REMOVED***
  const transporter = nodemailer.createTransport(***REMOVED***
    host: process.env.SMTP_HOSTNAME,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: ***REMOVED***
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    ***REMOVED***
  ***REMOVED***);

  const info = await transporter.sendMail(***REMOVED***
    from: process.env.SMTP_HOSTNAME,
    to: email,
    subject,
    text,
    html
  ***REMOVED***);
***REMOVED***;
