'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Admins',
      [
        {
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
};
