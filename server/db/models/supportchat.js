'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SupportChat extends Model {
    static associate({ Customer, Admin, SupportMessage }) {
      SupportChat.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
      SupportChat.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });
      SupportChat.hasMany(SupportMessage, {
        foreignKey: 'chatId',
        as: 'messages',
        onDelete: 'CASCADE',
      });
    }
  }

  SupportChat.init(
    {
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      adminId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('open', 'closed'),
        allowNull: false,
        defaultValue: 'open',
      },
    },
    {
      sequelize,
      modelName: 'SupportChat',
    },
  );

  return SupportChat;
};
