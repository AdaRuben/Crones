const express = require('express');
const CustomerOrderController = require('../controllers/customerOrder.controller');
const verifyCustomerToken = require('../middlewares/verifyCustomerToken');

const customerOrderRouter = express.Router();

customerOrderRouter.use(verifyCustomerToken);
customerOrderRouter.get('/', CustomerOrderController.getAllOrders);
customerOrderRouter.post('/', CustomerOrderController.createOrder);
customerOrderRouter.get('/:id', CustomerOrderController.getOrderById);
customerOrderRouter.patch(
  '/:id/customerComment',
  CustomerOrderController.updateOrderCustomerComment,
);

// Cancel order
customerOrderRouter.patch('/:id/cancel', CustomerOrderController.cancelOrder);

module.exports = customerOrderRouter;
