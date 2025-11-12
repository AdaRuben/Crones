'use strict';

/** @type {import('sequelize-cli').Seed} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Drivers',
      [
        {
          name: 'Алексей Смирнов',
          phoneNumber: '+79161112233',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Александр Ворона',
          phoneNumber: '+79162223344',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Дмитрий Иванов',
          phoneNumber: '+79163334455',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Drivers', null, {});
  },
};
