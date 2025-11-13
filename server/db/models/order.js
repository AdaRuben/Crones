'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Customer, Driver }) {
      Order.belongsTo(Customer, { foreignKey: 'customerId' });
      Order.belongsTo(Driver, { foreignKey: 'driverId' });
    }
  }
  Order.init(
    {
      customerId: DataTypes.INTEGER,
      driverId: DataTypes.INTEGER,
      from: DataTypes.STRING,
      to: DataTypes.STRING,
      totalCost: DataTypes.DECIMAL,
      status: DataTypes.ENUM('new', 'in process', 'finished', 'cancelled'),
      isPaid: DataTypes.BOOLEAN,
      vehicle: DataTypes.ENUM('Седан', 'Кроссовер', 'Внедорожник'),
      customerComment: DataTypes.TEXT,
      adminComment: DataTypes.TEXT,
      finishedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Order',
    },
  );
  return Order;
};
