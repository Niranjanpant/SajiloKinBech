const nodemailer = require("nodemailer");

//send email to welcome new user
const sendEmail = async ({ email, subject, text }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.SMTP_Email}`,
    to: email,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
