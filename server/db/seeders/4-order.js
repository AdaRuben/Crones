'use strict';

/** @type {import('sequelize-cli').Seed} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Orders',
      [
        {
          customerId: 1,
          driverId: 1,
          from: 'Москва',
          to: 'Красногорск',
          totalCost: 1500.75,
          status: 'new',
          isPaid: false,
          vehicle: 'Седан',
          customerComment: 'Пожалуйста, без опозданий',
          adminComment: null,
          finishedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          customerId: 2,
          driverId: 2,
          from: 'Химки',
          to: 'Мытищи',
          totalCost: 700.0,
          status: 'in process',
          isPaid: true,
          vehicle: 'Кроссовер',
          customerComment: null,
          adminComment: 'Водитель назначен',
          finishedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          customerId: 3,
          driverId: null,
          from: 'Люберцы',
          to: 'Москва',
          totalCost: 900,
          status: 'finished',
          isPaid: true,
          vehicle: 'Внедорожник',
          customerComment: 'Позвоните по приезду',
          adminComment: 'Завершено успешно',
          finishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Orders', null, {});
  },
};
