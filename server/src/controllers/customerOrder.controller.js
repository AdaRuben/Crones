const CustomerOrderService = require('../services/customerOrder.service');

class CustomerOrderController {
  static async getAllOrders(req, res) {
    try {
      const customerId = res.locals.customer.id;
      const orders = await CustomerOrderService.getAllOrders(customerId);
      res.status(200).json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getOrderById(req, res) {
    try {
      const customerId = res.locals.customer.id;
      const order = await CustomerOrderService.getOrderById(req.params.id, customerId);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.status(200).json(order);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async createOrder(req, res) {
    try {
      const customerId = res.locals.customer.id;
      const order = await CustomerOrderService.createOrder({ ...req.body, customerId });
      res.status(201).json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updateOrderCustomerComment(req, res) {
    try {
      const customerId = res.locals.customer.id;
      const { customerComment } = req.body;
      const updatedOrder = await CustomerOrderService.updateOrderCustomerComment(
        req.params.id,
        customerId,
        customerComment,
      );
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.log(error);
      if (error.message === 'Order not found') {
        res.status(404).json({ error: 'Order not found' });
      } else if (
        error.message === 'Unauthorized: You can only update your own comments'
      ) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }

  static async cancelOrder(req, res) {
    try {
      const customerId = res.locals.customer.id;
      const cancelledOrder = await CustomerOrderService.cancelOrder(
        req.params.id,
        customerId,
      );
      res.status(200).json(cancelledOrder);
    } catch (error) {
      console.log(error);
      if (error.message === 'Order not found') {
        res.status(404).json({ error: 'Order not found' });
      } else if (error.message === 'Unauthorized: You can only cancel your own orders') {
        res.status(403).json({ error: error.message });
      } else if (error.message === 'Cannot cancel finished order') {
        res.status(400).json({ error: error.message });
      } else if (error.message === 'Order is already cancelled') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }
}

module.exports = CustomerOrderController;
