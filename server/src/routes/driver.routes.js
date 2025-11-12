const express = require('express');
const DriverController = require('../controllers/driver.controller');

const driverRouter = express.Router();

driverRouter.get('/', DriverController.getAllDrivers);
driverRouter.post('/', DriverController.createDriver);
driverRouter.get('/:id', DriverController.getDriverById);
driverRouter.put('/:id', DriverController.updateDriver);
driverRouter.delete('/:id', DriverController.deleteDriver);

driverRouter.patch('/:id/name', DriverController.updateDriverName);
driverRouter.patch('/:id/phoneNumber', DriverController.updateDriverPhoneNumber);

driverRouter.get('/:id/orders', DriverController.getDriverOrders);
driverRouter.get('/:id/orders/active', DriverController.getDriverActiveOrders);

module.exports = driverRouter;
