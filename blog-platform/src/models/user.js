/**
 * Модель User:
 * - username, email, password
 * - theme       — 'light' или 'dark'
 * - postBg      — цвет фона постов
 * - postTextColor — цвет текста в постах
 */
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			username: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			theme: { type: DataTypes.STRING, defaultValue: 'light' },
			postBg: { type: DataTypes.STRING, defaultValue: '#ffffff' },
			postTextColor: { type: DataTypes.STRING, defaultValue: '#000000' },
		},
		{ timestamps: false }
	)

	User.associate = models => {
		User.hasMany(models.Post, { foreignKey: 'user_id' })
		User.hasMany(models.File, { foreignKey: 'user_id' })
	}

	return User
}
