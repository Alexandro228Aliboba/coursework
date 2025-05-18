/**
 * Middleware для защиты маршрутов:
 * Если пользователь залогинен (req.isAuthenticated()),
 * передаём управление дальше, иначе редиректим на /login.
 */
module.exports = {
	ensureAuthenticated: (req, res, next) => {
		if (req.isAuthenticated()) return next()
		req.flash('error_msg', 'Войдите')
		res.redirect('/login')
	},
}
