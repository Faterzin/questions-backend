const { Router } = require('express')
const { listQuestions } = require('../controllers/questionsController')
const rateLimiter = require('../middlewares/rateLimiter')

const router = Router()

router.get('/', rateLimiter, listQuestions)

module.exports = router
