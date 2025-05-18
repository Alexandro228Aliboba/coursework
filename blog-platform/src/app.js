/**
 * Основной файл приложения:
 * - Настраивает Express, Helmet, сессии, Passport и flash-сообщения
 * - Подключает EJS-layouts и статические файлы
 * - Регистрирует маршруты для авторизации, постов и профиля
 * - Запускает HTTPS-сервер с self-signed сертификатом
 */
require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const path = require('path')
const https = require('https')
const selfsigned = require('selfsigned')
const expressLayouts = require('express-ejs-layouts')

const sequelize = require('./config/db') // Подключение к БД
require('./config/passport')(passport) // Конфиг Passport

const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/posts')
const profileRoutes = require('./routes/profile')
const { ensureAuthenticated } = require('./middlewares/auth')

const app = express()

// Настройка EJS-layouts
app.use(expressLayouts)
app.set('layout', 'layouts/main')

app.use(helmet()) // Базовые заголовки безопасности
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: [
				"'self'",
				"'unsafe-inline'",
				'blob:',
				'https://cdn.quilljs.com',
			],
			styleSrc: [
				"'self'",
				"'unsafe-inline'",
				'https://cdn.quilljs.com',
				'https://stackpath.bootstrapcdn.com',
			],
			imgSrc: ["'self'", 'data:', 'blob:'],
			connectSrc: ["'self'"],
			fontSrc: [
				"'self'",
				'https://cdn.quilljs.com',
				'https://stackpath.bootstrapcdn.com',
				'data:',
			],
			objectSrc: ["'none'"],
			upgradeInsecureRequests: [],
		},
	})
)

// Шаблонизатор и статика
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({ extended: false }))

// Сессии
app.use(
	session({
		secret: process.env.SESSION_SECRET, // ключ подписи куки
		resave: false,
		saveUninitialized: false,
	})
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Прокидываем в шаблоны user и flash-сообщения
app.use((req, res, next) => {
	res.locals.user = req.user || { theme: 'light', postBg: '#ffffff' }
	res.locals.messages = req.flash()
	next()
})

// Корневой маршрут: перенаправляем в /posts или /login
app.get('/', (req, res) => {
	return req.isAuthenticated() ? res.redirect('/posts') : res.redirect('/login')
})

// Регистрируем роуты
app.use('/', authRoutes)
app.use('/posts', ensureAuthenticated, postRoutes)
app.use('/profile', ensureAuthenticated, profileRoutes)

// Генерация self-signed сертификата и запуск HTTPS
const attrs = [{ name: 'commonName', value: 'localhost' }]
const pems = selfsigned.generate(attrs, { days: 365 })
https
	.createServer({ key: pems.private, cert: pems.cert }, app)
	.listen(process.env.PORT || 3000, () => {
		console.log('HTTPS Server started on port ' + (process.env.PORT || 3000))
	})
