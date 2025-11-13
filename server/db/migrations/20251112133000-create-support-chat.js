'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SupportChats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Customers',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      adminId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Admins',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('open', 'closed'),
        defaultValue: 'open',
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

    await queryInterface.addIndex('SupportChats', ['customerId'], {
      name: 'support_chats_customer_idx',
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('SupportChats', 'support_chats_customer_idx');
    await queryInterface.dropTable('SupportChats');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_SupportChats_status";',
    );
  },
};
