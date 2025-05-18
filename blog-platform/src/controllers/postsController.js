/**
 * Контроллер CRUD для постов:
 * - index: список постов текущего пользователя
 * - showNew: форма создания
 * - create: создание поста, главное фото и вложения
 * - show: просмотр одного поста
 * - showEdit: форма редактирования
 * - update: обновление поста + фото + вложения
 * - delete: удаление поста
 */
const { Post, File } = require('../models')

module.exports = {
	index: async (req, res) => {
		try {
			const posts = await Post.findAll({
				where: { user_id: req.user.id },
				include: [File], // Подтягиваем файлы
				order: [['createdAt', 'DESC']], // Сортируем по дате
			})
			return res.render('posts/index', { posts, title: 'Мои посты' })
		} catch (err) {
			console.error('postsController.index:', err)
			return res.sendStatus(500)
		}
	},

	showNew: (req, res) => {
		res.render('posts/new', { title: 'Новый пост' })
	},

	create: async (req, res) => {
		try {
			const { title, content } = req.body
			// 1) Создаём пост
			const post = await Post.create({ title, content, user_id: req.user.id })

			// 2) Главное фото
			if (req.files.image?.length) {
				const img = req.files.image[0]
				await File.create({
					filename: img.filename,
					path: `/uploads/${img.filename}`,
					mime_type: img.mimetype,
					post_id: post.id,
					user_id: req.user.id,
					isMain: true,
				})
			}

			// 3) Остальные вложения
			if (req.files.files?.length) {
				const others = req.files.files.map(f => ({
					filename: f.filename,
					path: `/uploads/${f.filename}`,
					mime_type: f.mimetype,
					post_id: post.id,
					user_id: req.user.id,
					isMain: false,
				}))
				await File.bulkCreate(others)
			}

			return res.redirect('/posts')
		} catch (err) {
			console.error('postsController.create:', err)
			return res.sendStatus(500)
		}
	},

	show: async (req, res) => {
		try {
			const post = await Post.findByPk(req.params.id, { include: [File] })
			return res.render('posts/show', { post, title: post.title })
		} catch (err) {
			console.error('postsController.show:', err)
			return res.sendStatus(500)
		}
	},

	showEdit: async (req, res) => {
		try {
			const post = await Post.findByPk(req.params.id, { include: [File] })
			return res.render('posts/edit', { post, title: 'Редактировать пост' })
		} catch (err) {
			console.error('postsController.showEdit:', err)
			return res.sendStatus(500)
		}
	},

	update: async (req, res) => {
		try {
			const { title, content } = req.body
			// Обновляем текст и заголовок
			await Post.update(
				{ title, content },
				{ where: { id: req.params.id, user_id: req.user.id } }
			)

			// Удаляем старые файлы
			await File.destroy({ where: { post_id: req.params.id } })

			// Сохраняем новое главное фото
			if (req.files.image?.length) {
				const img = req.files.image[0]
				await File.create({
					filename: img.filename,
					path: `/uploads/${img.filename}`,
					mime_type: img.mimetype,
					post_id: req.params.id,
					user_id: req.user.id,
					isMain: true,
				})
			}

			// Сохраняем новые вложения
			if (req.files.files?.length) {
				const others = req.files.files.map(f => ({
					filename: f.filename,
					path: `/uploads/${f.filename}`,
					mime_type: f.mimetype,
					post_id: req.params.id,
					user_id: req.user.id,
					isMain: false,
				}))
				await File.bulkCreate(others)
			}

			return res.redirect('/posts')
		} catch (err) {
			console.error('postsController.update:', err)
			return res.sendStatus(500)
		}
	},

	delete: async (req, res) => {
		try {
			await Post.destroy({
				where: { id: req.params.id, user_id: req.user.id },
			})
			return res.redirect('/posts')
		} catch (err) {
			console.error('postsController.delete:', err)
			return res.sendStatus(500)
		}
	},
}
