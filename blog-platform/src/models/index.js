// Автоматическая загрузка всех моделей и их ассоциаций
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const sequelize = require('../config/db')
const db = {}
fs.readdirSync(__dirname)
	.filter(f => f !== 'index.js')
	.forEach(file => {
		const model = require(path.join(__dirname, file))(
			sequelize,
			Sequelize.DataTypes
		)
		db[model.name] = model
	})
Object.keys(db).forEach(name => {
	if (db[name].associate) db[name].associate(db)
})
db.sequelize = sequelize
db.Sequelize = Sequelize
module.exports = db
