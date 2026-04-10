const { Router } = require('express')
const { listQuestions } = require('../controllers/questionsController')
const base64Response = require('../middlewares/base64Response')

const router = Router()

router.get('/', base64Response, listQuestions)

module.exports = router
