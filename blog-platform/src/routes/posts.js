/**
 * Маршруты CRUD для постов:
 * - GET  /posts         — список
 * - GET  /posts/new     — форма создания
 * - POST /posts         — создание
 * - GET  /posts/:id     — просмотр
 * - GET  /posts/:id/edit — форма редактирования
 * - POST /posts/:id/edit — обновление
 * - POST /posts/:id/delete — удаление
 */
const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../middlewares/auth')
const posts = require('../controllers/postsController')
const upload = require('../config/multer')

// Multer fields: одно фото и до 10 файлов
const uploader = upload.fields([
	{ name: 'image', maxCount: 1 },
	{ name: 'files', maxCount: 10 },
])

router.get('/', ensureAuthenticated, posts.index)
router.get('/new', ensureAuthenticated, posts.showNew)
router.post('/', ensureAuthenticated, uploader, posts.create)
router.get('/:id', ensureAuthenticated, posts.show)
router.get('/:id/edit', ensureAuthenticated, posts.showEdit)
router.post('/:id/edit', ensureAuthenticated, uploader, posts.update)
router.post('/:id/delete', ensureAuthenticated, posts.delete)

module.exports = router
