'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Customers',
          key: 'id',
        },
        allowNull: false,
      },
      driverId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Drivers',
          key: 'id',
        },
      },
      from: {
        type: Sequelize.STRING,
      },
      to: {
        type: Sequelize.STRING,
      },
      totalCost: {
        type: Sequelize.DECIMAL,
      },
      status: {
        type: Sequelize.ENUM('new', 'in process', 'finished', 'cancelled'),
        allowNull: false,
        defaultValue: 'new',
      },
      isPaid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      vehicle: {
        type: Sequelize.ENUM('Кроссовер', 'Седан'),
      },
      customerComment: {
        type: Sequelize.TEXT,
      },
      adminComment: {
        type: Sequelize.TEXT,
      },
      finishedAt: {
        type: Sequelize.DATE,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  },
};
