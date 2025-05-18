/**
 * Контроллер профиля пользователя:
 * - showProfile: отображает личную страницу с кол-вом постов
 * - showSettings: форма настроек дизайна
 * - updateSettings: сохраняет выбранную тему, фон и цвет текста
 */
const { User, Post } = require('../models')

module.exports = {
	showProfile: async (req, res) => {
		// Получаем все посты пользователя
		const posts = await Post.findAll({ where: { user_id: req.user.id } })
		res.render('profile/index', { posts, title: 'Профиль' })
	},

	showSettings: (req, res) => {
		res.render('profile/settings', { title: 'Настройки' })
	},

	updateSettings: async (req, res) => {
		const { theme, postBg, postTextColor } = req.body
		// Обновляем поля в таблице Users
		await User.update(
			{ theme, postBg, postTextColor },
			{ where: { id: req.user.id } }
		)
		res.redirect('/profile')
	},
}
