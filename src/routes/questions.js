const { Router } = require('express')
const { listQuestions } = require('../controllers/questionsController')

const router = Router()

router.get('/', listQuestions)

module.exports = router
