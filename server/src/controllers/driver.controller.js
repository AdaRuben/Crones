const DriverService = require('../services/driver.service');

class DriverController {
  static async getAllDrivers(req, res) {
    try {
      const drivers = await DriverService.getAllDrivers();
      res.status(200).json(drivers);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getDriverById(req, res) {
    try {
      const driver = await DriverService.getDriverById(req.params.id);
      if (!driver) {
        res.status(404).json({ error: 'Driver not found' });
      } else {
        res.status(200).json(driver);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async createDriver(req, res) {
    try {
      const driver = await DriverService.createDriver(req.body);
      res.status(201).json(driver);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updateDriver(req, res) {
    try {
      const updatedDriver = await DriverService.updateDriver(req.params.id, req.body);
      res.status(200).json(updatedDriver);
    } catch (error) {
      console.log(error);
      if (error.message === 'Driver not found') {
        res.status(404).json({ error: 'Driver not found' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }

  static async deleteDriver(req, res) {
    try {
      await DriverService.deleteDriver(req.params.id);
      res.status(204).json({ message: 'Driver deleted successfully' });
    } catch (error) {
      console.log(error);
      if (error.message === 'Driver not found') {
        res.status(404).json({ error: 'Driver not found' });
      } else if (error.message === 'Cannot delete driver with active orders') {
        res.status(400).json({ error: 'Cannot delete driver with active orders' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }

  static async updateDriverName(req, res) {
    try {
      const { name } = req.body;
      const updatedDriver = await DriverService.updateDriverName(req.params.id, name);
      res.status(200).json(updatedDriver);
    } catch (error) {
      console.log(error);
      if (error.message === 'Driver not found') {
        res.status(404).json({ error: 'Driver not found' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }

  static async updateDriverPhoneNumber(req, res) {
    try {
      const { phoneNumber } = req.body;
      const updatedDriver = await DriverService.updateDriverPhoneNumber(
        req.params.id,
        phoneNumber,
      );
      res.status(200).json(updatedDriver);
    } catch (error) {
      console.log(error);
      if (error.message === 'Driver not found') {
        res.status(404).json({ error: 'Driver not found' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }

  static async getDriverOrders(req, res) {
    try {
      const orders = await DriverService.getDriverOrders(req.params.id);
      res.status(200).json(orders);
    } catch (error) {
      console.log(error);
      if (error.message === 'Driver not found') {
        res.status(404).json({ error: 'Driver not found' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }

  static async getDriverActiveOrders(req, res) {
    try {
      const orders = await DriverService.getDriverActiveOrders(req.params.id);
      res.status(200).json(orders);
    } catch (error) {
      console.log(error);
      if (error.message === 'Driver not found') {
        res.status(404).json({ error: 'Driver not found' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }
}

module.exports = DriverController;
