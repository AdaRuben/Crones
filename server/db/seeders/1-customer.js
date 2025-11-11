'use strict';

/** @type {import('sequelize-cli').Seed} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Customers',
      [
        {
          name: 'Иван Иванов',
          phoneNumber: '+79991112233',
          hashpass: '$2b$10$5.9.1.3.2.7.4.6.8.5.0.1.0.2.3.4.5.6.7.8.9.0.1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Мария Смирнова',
          phoneNumber: '+79994445566',
          hashpass: '$2b$10$5.9.1.3.2.7.4.6.8.0.1.0.2.3.4.5.6.7.8.9.0.1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          name: 'Пётр Петров',
          phoneNumber: '+79997778899',
          hashpass: '$2b$10$5.9.1.3.2.7.4.6.8.5.0.1.0.2.3.4.5.6.7.8.9.0.1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Customers', null, {});
  },
};
