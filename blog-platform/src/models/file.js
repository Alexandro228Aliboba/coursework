/**
 * Модель File:
 * - filename, path, mime_type
 * - post_id, user_id — связи
 * - isMain          — флаг главного фото
 */
module.exports = (sequelize, DataTypes) => {
	const File = sequelize.define(
		'File',
		{
			filename: DataTypes.STRING,
			path: DataTypes.STRING,
			mime_type: DataTypes.STRING,
			post_id: DataTypes.INTEGER,
			user_id: DataTypes.INTEGER,
			isMain: { type: DataTypes.BOOLEAN, defaultValue: false },
		},
		{ timestamps: false }
	)

	File.associate = models => {
		File.belongsTo(models.Post, { foreignKey: 'post_id', onDelete: 'CASCADE' })
		File.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' })
	}

	return File
}
