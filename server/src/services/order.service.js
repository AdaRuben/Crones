const { Order } = require('../../db/models');

class OrderService {
  static async getAllOrders() {
    return Order.findAll();
  }

  static async createOrder(order) {
    return Order.create(order);
  }

  static async getOrderById(id) {
    return Order.findByPk(id);
  }

  static async updateOrder(id, order) {
    const updatedOrder = await Order.findByPk(id);
    if (!updatedOrder) {
      throw new Error('Order not found');
    }
    return updatedOrder.update(order);
  }

  static async deleteCancelledOrder(id) {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status !== 'cancelled') {
      throw new Error('Only cancelled orders can be deleted');
    }
    return order.destroy();
  }

  static async updateOrderStatus(id, status) {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order.update({ status });
  }

  static async updateOrderIsPaid(id, isPaid) {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order.update({ isPaid });
  }

  static async updateOrderCustomerComment(id, customerComment) {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order.update({ customerComment });
  }

  static async updateOrderAdminComment(id, adminComment) {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order.update({ adminComment });
  }

  static async updateOrderTotalCost(id, totalCost) {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order.update({ totalCost });
  }
}

exports.orderService = OrderService;
