/**
 * Конфигурация Sequelize для подключения к MySQL.
 * Использует переменные окружения для настройки.
 */
const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
	process.env.DB_NAME, // Имя базы
	process.env.DB_USER, // Пользователь
	process.env.DB_PASS, // Пароль
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT || 3306,
		dialect: 'mysql',
		define: { timestamps: false }, // Отключаем createdAt/updatedAt
		logging: console.log, // Логируем SQL-запросы в консоль
	}
)

module.exports = sequelize
