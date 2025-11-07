const OrderService = require('../services/order.service');

class OrderController {
  static async getAllOrders(req, res) {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getOrderById(req, res) {
    try {
      const order = await OrderService.getOrderById(req.params.id);
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
      const order = await OrderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updateOrder(req, res) {
    try {
      const updatedOrder = await OrderService.updateOrder(req.params.id, req.body);
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async deleteCancelledOrder(req, res) {
    try {
      await OrderService.deleteCancelledOrder(req.params.id);
      res.status(204).json({ message: 'Cancelled order deleted successfully' });
    } catch (error) {
      console.log(error);
      if (error.message === 'Order not found') {
        res.status(404).json({ error: 'Order not found' });
      } else if (error.message === 'Only cancelled orders can be deleted') {
        res.status(400).json({ error: 'Only cancelled orders can be deleted' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      const updatedOrder = await OrderService.updateOrderStatus(req.params.id, status);
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.log(error);
      if (error.message === 'Order not found') {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }

  static async updateOrderIsPaid(req, res) {
    try {
      const { isPaid } = req.body;
      const updatedOrder = await OrderService.updateOrderIsPaid(req.params.id, isPaid);
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.log(error);
      if (error.message === 'Order not found') {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }

  static async updateOrderCustomerComment(req, res) {
    try {
      const { customerComment } = req.body;
      const updatedOrder = await OrderService.updateOrderCustomerComment(
        req.params.id,
        customerComment,
      );
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.log(error);
      if (error.message === 'Order not found') {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }

  static async updateOrderAdminComment(req, res) {
    try {
      const { adminComment } = req.body;
      const updatedOrder = await OrderService.updateOrderAdminComment(
        req.params.id,
        adminComment,
      );
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.log(error);
      if (error.message === 'Order not found') {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }

  static async updateOrderTotalCost(req, res) {
    try {
      const { totalCost } = req.body;
      const updatedOrder = await OrderService.updateOrderTotalCost(
        req.params.id,
        totalCost,
      );
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.log(error);
      if (error.message === 'Order not found') {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }
}

module.exports = OrderController;
