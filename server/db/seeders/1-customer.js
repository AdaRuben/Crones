'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Seed} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Customers',
      [
        {
          name: 'Иван Иванов',
          phoneNumber: '+79999999999',
          hashpass: await bcrypt.hash('kekkek', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Мария Смирнова',
          phoneNumber: '+79994445566',
          hashpass: await bcrypt.hash('kekkek', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Пётр Петров',
          phoneNumber: '+79997778899',
          hashpass: await bcrypt.hash('kekkek', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Customers', null, {});
  },
};
