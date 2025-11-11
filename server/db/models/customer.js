'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order }) {
      Customer.hasMany(Order, { foreignKey: 'customerId' });
    }
  }
  Customer.init(
    {
      name: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      hashpass: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Customer',
    },
  );
  return Customer;
};
