const { Order } = require('../../db/models');

const { Customer } = require('../../db/models');
const { Driver } = require('../../db/models');

class CustomerOrderService {
  static async getAllOrders(customerId) {
    return Order.findAll({
      where: { customerId },
      include: [
        { model: Customer, attributes: ['name', 'phoneNumber'] },
        { model: Driver, attributes: ['name', 'phoneNumber'] },
      ],
    });
  }

  static async createOrder(order) {
    return Order.create(order);
  }

  static async getOrderById(id, customerId) {
    return Order.findByPk(id, {
      where: { customerId },
      include: [
        { model: Customer, attributes: ['name', 'phoneNumber'] },
        { model: Driver, attributes: ['name', 'phoneNumber'] },
      ],
    });
  }

  static async updateOrderCustomerComment(id, customerId, customerComment) {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.customerId !== customerId) {
      throw new Error('Unauthorized: You can only update your own comments');
    }
    return order.update({ customerComment });
  }

  static async cancelOrder(id, customerId) {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.customerId !== customerId) {
      throw new Error('Unauthorized: You can only cancel your own orders');
    }
    if (order.status === 'finished') {
      throw new Error('Cannot cancel finished order');
    }
    if (order.status === 'cancelled') {
      throw new Error('Order is already cancelled');
    }
    return order.update({ status: 'cancelled' });
  }
}

module.exports = CustomerOrderService;
