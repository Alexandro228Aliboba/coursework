/**
 * Контроллер авторизации:
 * - showRegister: показывает форму регистрации
 * - register: валидация и создание пользователя
 * - showLogin: показывает форму входа
 * - login: Passport.authenticate
 * - logout: выход из сессии
 */
const bcrypt = require('bcrypt')
const passport = require('passport')
const { User } = require('../models')

module.exports = {
	showRegister: (req, res) => {
		res.render('register', {
			title: 'Регистрация',
			errors: [],
			username: '',
			email: '',
		})
	},

	register: async (req, res) => {
		const { username, email, password, confirmPassword } = req.body
		const errors = []

		// Валидация
		if (!username || !email || !password || !confirmPassword)
			errors.push({ msg: 'Заполните все поля' })
		if (password !== confirmPassword)
			errors.push({ msg: 'Пароли не совпадают' })
		if (password.length < 6) errors.push({ msg: 'Пароль не менее 6 символов' })

		if (errors.length) {
			// Возвращаем форму с ошибками и введёнными полями
			return res.render('register', {
				title: 'Регистрация',
				errors,
				username,
				email,
			})
		}

		try {
			// Проверяем уникальность email
			const exists = await User.findOne({ where: { email } })
			if (exists) {
				return res.render('register', {
					title: 'Регистрация',
					errors: [{ msg: 'Email уже занят' }],
					username,
					email,
				})
			}

			// Хешируем пароль и создаём пользователя
			const hash = await bcrypt.hash(password, 10)
			await User.create({ username, email, password: hash })

			req.flash(
				'success_msg',
				'Вы успешно зарегистрированы. Пожалуйста, войдите.'
			)
			res.redirect('/login')
		} catch (err) {
			console.error('Ошибка в authController.register:', err)
			res.render('register', {
				title: 'Регистрация',
				errors: [{ msg: 'Внутренняя ошибка сервера' }],
				username,
				email,
			})
		}
	},

	showLogin: (req, res) => {
		res.render('login', { title: 'Вход' })
	},

	login: (req, res, next) =>
		passport.authenticate('local', {
			successRedirect: '/posts',
			failureRedirect: '/login',
			failureFlash: true,
		})(req, res, next),

	logout: (req, res) =>
		req.logout(() => {
			req.flash('success_msg', 'Вы вышли')
			res.redirect('/login')
		}),
}
