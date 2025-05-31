'use strict';

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
    // Генерируем 20 разных пользователей с реалистичными именами и email
    const users = [];

    for (let i = 0; i < 20; i++) {
      const firstName = faker.name.firstName();
      const lastName  = faker.name.lastName();
      const email     = faker.internet
                             .email(firstName, lastName)
                             .toLowerCase();
      const hash      = await bcrypt.hash(faker.internet.password(8), 10);

      users.push({
        username:      `${firstName} ${lastName}`,
        email:         email,
        password:      hash,
        theme:         faker.helpers.arrayElement(['light', 'dark']),
        postBg:        faker.color.rgb({ format: 'hex' }),
        postTextColor: faker.color.rgb({ format: 'hex' })
      });
    }

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down (queryInterface, Sequelize) {
    // Откат — удаляем всех, чей email соответствует шаблону faker
    const emails = await queryInterface.sequelize.query(
      `SELECT email FROM Users WHERE email LIKE '%@%.%' LIMIT 20;`
    ).then(([results]) => results.map(r => r.email));

    await queryInterface.bulkDelete('Users', {
      email: { [Sequelize.Op.in]: emails }
    }, {});
  }
};
