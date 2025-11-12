const transporter = require('../configs/mail.config');

class MailService {
  static async sendNewOrderEmail(order) {
    console.log(order);
    
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return;

    await transporter.sendMail({
      from: `"Crones" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: 'Новый заказ',
      text: `Получен новый заказ №${order.id}.`,
      html: `<p>Получен новый заказ №${order.id}.</p>`,
    });
  }
}

module.exports = MailService;