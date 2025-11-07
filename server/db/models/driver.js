'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Driver extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order }) {
      Driver.hasMany(Order, { foreignKey: 'driverId' });
    }
  }
  Driver.init(
    {
      name: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Driver',
    },
  );
  return Driver;
};
