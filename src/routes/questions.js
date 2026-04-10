const { Router } = require('express')
const { listQuestions } = require('../controllers/questionsController')
const rateLimiter = require('../middlewares/rateLimiter')
const base64Response = require('../middlewares/base64Response')

const router = Router()

router.get('/', rateLimiter, base64Response, listQuestions)

module.exports = router
