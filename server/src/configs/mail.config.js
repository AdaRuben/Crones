const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.mail.ru
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER, // твой_ящик@mail.ru
    pass: process.env.SMTP_PASS, // пароль приложения, а не обычный
  },
});

module.exports = transporter;