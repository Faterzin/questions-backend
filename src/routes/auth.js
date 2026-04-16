const { Router } = require('express')
const { login, me } = require('../controllers/authController')
const { authMiddleware } = require('../middlewares/auth')

const router = Router()

router.post('/login', login)
router.get('/me', authMiddleware, me)

module.exports = router
