const express = require('express');
const OrderController = require('../controllers/order.controller');

const orderRouter = express.Router();

orderRouter.get('/', OrderController.getAllOrders);
orderRouter.post('/', OrderController.createOrder);
orderRouter.get('/:id', OrderController.getOrderById);
orderRouter.put('/:id', OrderController.updateOrder);
orderRouter.delete('/:id', OrderController.deleteCancelledOrder);

orderRouter.patch('/:id/status', OrderController.updateOrderStatus);
orderRouter.patch('/:id/isPaid', OrderController.updateOrderIsPaid);
orderRouter.patch('/:id/customerComment', OrderController.updateOrderCustomerComment);
orderRouter.patch('/:id/adminComment', OrderController.updateOrderAdminComment);
orderRouter.patch('/:id/totalCost', OrderController.updateOrderTotalCost);
orderRouter.patch('/:id/driver', OrderController.updateOrderDriver);

module.exports = orderRouter;
