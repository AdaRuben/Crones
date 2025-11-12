const MailService = require('../services/mail.service');
const OrderService = require('../services/order.service');

class MailController {
  static async createOrder(req, res) {
    try {
      const order = await OrderService.createOrder(req.body);
      MailService.sendNewOrderEmail(order).catch((err) =>
        console.error('Mail error:', err),
      );
      res.status(201).json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = MailController;