/**
 * Настройка Passport.js с LocalStrategy:
 * - Ищем пользователя по email
 * - Сравниваем bcrypt-хеш пароля
 * - Сериализуем и десериализуем по id
 */
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { User } = require('../models')

module.exports = function (passport) {
	passport.use(
		new LocalStrategy(
			{ usernameField: 'email' },
			async (email, password, done) => {
				try {
					const user = await User.findOne({ where: { email } })
					if (!user) return done(null, false, { message: 'Неверный email' })
					const match = await bcrypt.compare(password, user.password)
					if (!match) return done(null, false, { message: 'Неверный пароль' })
					return done(null, user)
				} catch (err) {
					return done(err)
				}
			}
		)
	)

	// Сохраняем в сессии user.id
	passport.serializeUser((user, done) => done(null, user.id))
	// При запросах достаём из БД по id
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findByPk(id)
			done(null, user)
		} catch (err) {
			done(err)
		}
	})
}
