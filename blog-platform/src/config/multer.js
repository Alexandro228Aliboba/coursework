/**
 * Конфигурация Multer для сохранения загружаемых файлов.
 * - Файлы сохраняются в public/uploads
 * - Генерируем уникальное имя с таймстампом
 * - При необходимости создаём папку uploads
 */
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads')
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
	// Куда сохранять
	destination: (req, file, cb) => cb(null, uploadDir),
	// Как назвать файл
	filename: (req, file, cb) => {
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(null, unique + path.extname(file.originalname))
	},
})

module.exports = multer({ storage })
