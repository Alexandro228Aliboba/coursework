/**
 * Модель Post:
 * - title, content — заголовок и HTML-контент
 * - user_id        — связь с автором (User)
 */
module.exports = (sequelize, DataTypes) => {
	const Post = sequelize.define(
		'Post',
		{
			title: { type: DataTypes.STRING, allowNull: false },
			content: { type: DataTypes.TEXT, allowNull: false },
			user_id: DataTypes.INTEGER,
		},
		{ timestamps: false }
	)

	Post.associate = models => {
		Post.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' })
		Post.hasMany(models.File, { foreignKey: 'post_id' })
	}

	return Post
}
