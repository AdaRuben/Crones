'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SupportMessages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      chatId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'SupportChats',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      senderType: {
        allowNull: false,
        type: Sequelize.ENUM('customer', 'admin'),
      },
      senderId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      body: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      attachments: {
        allowNull: true,
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('SupportMessages', ['chatId'], {
      name: 'support_messages_chat_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('SupportMessages', 'support_messages_chat_idx');
    await queryInterface.dropTable('SupportMessages');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_SupportMessages_senderType";',
    );
  },
};
