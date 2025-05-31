// seeders/20250602-02-realistic-posts-ru.js
'use strict';

/**
 * Сидер для создания реалистичных постов на русском языке:
 * - Берёт ID 20 последних пользователей из таблицы Users
 * - Генерирует по одному посту для каждого пользователя
 * - Использует @faker-js/faker с русской локалью для текста
 */

// Импортируем faker сразу с русской локалью
const { faker } = require('@faker-js/faker/locale/ru');

module.exports = {
  async up (queryInterface, Sequelize) {
    // 1) Получаем ID 20 самых последних пользователей
    const [rows] = await queryInterface.sequelize.query(`
      SELECT id
        FROM Users
       ORDER BY id DESC
       LIMIT 20
    `);
    // Преобразуем результат в массив чисел и разворачиваем,
    // чтобы посты шли в том же порядке, в котором создавались пользователи
    const userIds = rows.map(r => r.id).reverse();

    // 2) Генерируем массив постов с заголовками и содержимым на русском
    const posts = userIds.map(user_id => ({
      title:   faker.lorem.sentence(6),                       
               // примерно 6 слов на русском
      content: `<p>${faker.lorem.paragraphs(2, '</p><p>')}</p>`,
               // два абзаца русского «Lorem»
      user_id                                             // привязка к пользователю
    }));

    // 3) Вставляем все посты в таблицу Posts
    await queryInterface.bulkInsert('Posts', posts, {});
  },

  async down (queryInterface, Sequelize) {
    // Откат: удаляем те записи, которые сгенерированы этим сидером
    await queryInterface.bulkDelete('Posts', {
      content: { [Sequelize.Op.like]: '<p>%' }
    }, {});
  }
};
