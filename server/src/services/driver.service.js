const { Driver, Order } = require('../../db/models');

class DriverService {
  static async getAllDrivers() {
    return Driver.findAll({
      attributes: ['id', 'name', 'phoneNumber'],
    });
  }

  static async getDriverById(id) {
    return Driver.findByPk(id, {
      include: [
        {
          model: Order,
          as: 'Orders',
        },
      ],
    });
  }

  static async createDriver(driverData) {
    return Driver.create(driverData);
  }

  static async updateDriver(id, driverData) {
    const driver = await Driver.findByPk(id);
    if (!driver) {
      throw new Error('Driver not found');
    }
    return driver.update(driverData);
  }

  static async deleteDriver(id) {
    const driver = await Driver.findByPk(id);
    if (!driver) {
      throw new Error('Driver not found');
    }

    // Проверка, что у водителя нет активных заказов
    const activeOrders = await Order.count({
      where: {
        driverId: id,
        status: ['new', 'in process'],
      },
    });

    if (activeOrders > 0) {
      throw new Error('Cannot delete driver with active orders');
    }

    return driver.destroy();
  }

  static async updateDriverName(id, name) {
    const driver = await Driver.findByPk(id);
    if (!driver) {
      throw new Error('Driver not found');
    }
    return driver.update({ name });
  }

  static async updateDriverPhoneNumber(id, phoneNumber) {
    const driver = await Driver.findByPk(id);
    if (!driver) {
      throw new Error('Driver not found');
    }
    return driver.update({ phoneNumber });
  }

  static async getDriverOrders(id) {
    const driver = await Driver.findByPk(id, {
      include: [
        {
          model: Order,
          as: 'Orders',
        },
      ],
    });

    if (!driver) {
      throw new Error('Driver not found');
    }

    return driver.Orders;
  }

  static async getDriverActiveOrders(id) {
    const driver = await Driver.findByPk(id);
    if (!driver) {
      throw new Error('Driver not found');
    }

    return Order.findAll({
      where: {
        driverId: id,
        status: ['new', 'in process'],
      },
    });
  }
}

module.exports = DriverService;
