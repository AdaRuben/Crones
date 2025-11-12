'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SupportMessage extends Model {
    static associate({ SupportChat }) {
      SupportMessage.belongsTo(SupportChat, { foreignKey: 'chatId', as: 'chat' });
    }
  }

  SupportMessage.init(
    {
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      senderType: {
        type: DataTypes.ENUM('customer', 'admin'),
        allowNull: false,
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      attachments: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'SupportMessage',
    },
  );

  return SupportMessage;
};
