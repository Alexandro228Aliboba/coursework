/**
 * Маршруты авторизации:
 * - GET /register
 * - POST /register
 * - GET /login
 * - POST /login
 * - GET /logout (защищён)
 */
const express = require('express')
const router = express.Router()
const auth = require('../controllers/authController')
const { ensureAuthenticated } = require('../middlewares/auth')

router.get('/register', auth.showRegister)
router.post('/register', auth.register)
router.get('/login', auth.showLogin)
router.post('/login', auth.login)
router.get('/logout', ensureAuthenticated, auth.logout)

module.exports = router
