'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Admins',
      [
        {
          id: 1,
          name: 'kek',
          email: 'kek@kek',
          hashpass: await bcrypt.hash('kek', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
 
      await queryInterface.bulkDelete('Admins', null, {});
    
  },
};
