/**
 * Маршруты профиля:
 * - GET  /profile          — личная страница
 * - GET  /profile/settings — форма настроек
 * - POST /profile/settings — обновление настроек
 */
const express = require('express')
const router = express.Router()
const profile = require('../controllers/profileController')

router.get('/', profile.showProfile)
router.get('/settings', profile.showSettings)
router.post('/settings', profile.updateSettings)

module.exports = router
